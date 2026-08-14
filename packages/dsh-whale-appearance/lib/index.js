import { mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
//#region src/persist.ts
const PETS$1 = [
	"off",
	"whale-maid",
	"abstract-whale"
];
const SCALES$1 = [
	.8,
	1,
	1.2
];
const MAX_INSET = 1e4;
function appearanceHomeDir() {
	return process.env.DSH_HOME ?? join(homedir(), ".dsh");
}
function defaultSettings() {
	return {
		themeEnabled: false,
		pet: "off",
		petScale: 1,
		petPosition: {
			right: 24,
			bottom: 24
		}
	};
}
function inset(value, fallback) {
	if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
	return Math.round(Math.min(MAX_INSET, Math.max(0, value)));
}
function sanitizeSettings(value) {
	const base = defaultSettings();
	if (typeof value !== "object" || value === null) return base;
	const raw = value;
	const position = typeof raw.petPosition === "object" && raw.petPosition !== null ? raw.petPosition : base.petPosition;
	return {
		themeEnabled: typeof raw.themeEnabled === "boolean" ? raw.themeEnabled : base.themeEnabled,
		pet: PETS$1.includes(raw.pet) ? raw.pet : base.pet,
		petScale: SCALES$1.includes(raw.petScale) ? raw.petScale : base.petScale,
		petPosition: {
			right: inset(position.right, base.petPosition.right),
			bottom: inset(position.bottom, base.petPosition.bottom)
		}
	};
}
function loadSettings(dir = appearanceHomeDir()) {
	try {
		return sanitizeSettings(JSON.parse(readFileSync(join(dir, "whale-appearance.json"), "utf8")));
	} catch {
		return defaultSettings();
	}
}
function saveSettings(settings, dir = appearanceHomeDir()) {
	mkdirSync(dir, { recursive: true });
	const target = join(dir, "whale-appearance.json");
	const temporary = `${target}.tmp`;
	writeFileSync(temporary, JSON.stringify(sanitizeSettings(settings), null, 2), "utf8");
	renameSync(temporary, target);
}
//#endregion
//#region src/routes.ts
const API = "/api/whale-appearance";
const ASSET = "/whale-appearance/assets";
const PETS = [
	"off",
	"whale-maid",
	"abstract-whale"
];
const SCALES = [
	.8,
	1,
	1.2
];
const ASSETS = [
	{
		name: "whale-maid.jpg",
		mime: "image/jpeg"
	},
	{
		name: "abstract-whale.jpg",
		mime: "image/jpeg"
	},
	{
		name: "theme-reference.jpg",
		mime: "image/jpeg"
	}
];
function appearancePackageRoot(importMetaUrl) {
	return fileURLToPath(new URL("../", importMetaUrl));
}
function json(res, status, body) {
	res.writeHead(status, { "content-type": "application/json; charset=utf-8" });
	res.end(JSON.stringify(body));
}
function readJsonBody(req) {
	return new Promise((resolve, reject) => {
		let size = 0;
		const chunks = [];
		req.on("data", (chunk) => {
			size += chunk.length;
			if (size > 64 * 1024) {
				reject(/* @__PURE__ */ new Error("body-too-large"));
				return;
			}
			chunks.push(chunk);
		});
		req.on("end", () => {
			try {
				const value = chunks.length === 0 ? {} : JSON.parse(Buffer.concat(chunks).toString("utf8"));
				resolve(typeof value === "object" && value !== null ? value : {});
			} catch {
				reject(/* @__PURE__ */ new Error("invalid-json"));
			}
		});
		req.on("error", reject);
	});
}
function patchFrom(body) {
	const patch = {};
	if (typeof body.themeEnabled === "boolean") patch.themeEnabled = body.themeEnabled;
	if (body.pet !== void 0) {
		if (!PETS.includes(body.pet)) throw new Error("invalid-pet");
		patch.pet = body.pet;
	}
	if (body.petScale !== void 0) {
		if (!SCALES.includes(body.petScale)) throw new Error("invalid-pet-scale");
		patch.petScale = body.petScale;
	}
	if (body.petPosition !== void 0) {
		if (typeof body.petPosition !== "object" || body.petPosition === null) throw new Error("invalid-pet-position");
		const raw = body.petPosition;
		if (typeof raw.right !== "number" || typeof raw.bottom !== "number") throw new Error("invalid-pet-position");
		patch.petPosition = {
			right: raw.right,
			bottom: raw.bottom
		};
	}
	return patch;
}
function makeAppearanceRoutes(deps) {
	const { state, packageRoot } = deps;
	const apiRoutes = [{
		kind: "exact",
		path: `${API}/state`,
		handler(req, res) {
			if (req.method !== "GET") return json(res, 405, {
				ok: false,
				error: "method-not-allowed"
			});
			json(res, 200, state.snapshot());
		}
	}, {
		kind: "exact",
		path: `${API}/config`,
		handler(req, res) {
			if (req.method !== "POST") return json(res, 405, {
				ok: false,
				error: "method-not-allowed"
			});
			return readJsonBody(req).then((body) => json(res, 200, state.update(patchFrom(body))), (error) => json(res, 400, {
				ok: false,
				error: error instanceof Error ? error.message : String(error)
			})).catch((error) => {
				json(res, 400, {
					ok: false,
					error: error instanceof Error ? error.message : String(error)
				});
			});
		}
	}];
	const assetRoutes = ASSETS.map((file) => ({
		kind: "exact",
		path: `${ASSET}/${file.name}`,
		handler(req, res) {
			if (req.method !== "GET" && req.method !== "HEAD") {
				res.writeHead(405);
				res.end();
				return;
			}
			return readFile(join(packageRoot, "assets", "prototype", file.name)).then((body) => {
				res.writeHead(200, {
					"content-type": file.mime,
					"content-length": String(body.byteLength),
					"cache-control": "no-cache"
				});
				res.end(req.method === "HEAD" ? void 0 : body);
			}, () => {
				res.writeHead(404);
				res.end();
			});
		}
	}));
	return [...apiRoutes, ...assetRoutes];
}
//#endregion
//#region src/service.ts
function activityFromPhase(phase) {
	switch (phase) {
		case "idle": return "idle";
		case "thinking": return "thinking";
		case "tool": return "tool";
		case "waiting": return "waiting";
		case "done": return "completed";
		default: return "failed";
	}
}
var AppearanceState = class {
	persistDir;
	settings;
	activity = "idle";
	constructor(persistDir) {
		this.persistDir = persistDir;
		this.settings = loadSettings(persistDir);
	}
	snapshot() {
		return {
			...this.settings,
			petPosition: { ...this.settings.petPosition },
			activity: this.activity
		};
	}
	setActivity(phase) {
		this.activity = activityFromPhase(phase);
		return this.snapshot();
	}
	update(patch) {
		this.settings = sanitizeSettings({
			...this.settings,
			...patch,
			petPosition: patch.petPosition === void 0 ? this.settings.petPosition : {
				...this.settings.petPosition,
				...patch.petPosition
			}
		});
		saveSettings(this.settings, this.persistDir);
		return this.snapshot();
	}
};
//#endregion
//#region src/index.ts
const name = "whale-appearance";
const inject = ["webServer"];
function apply(ctx) {
	const state = new AppearanceState(appearanceHomeDir());
	const routes = makeAppearanceRoutes({
		state,
		packageRoot: appearancePackageRoot(import.meta.url)
	});
	ctx.effect(() => {
		const disposers = routes.map((route) => ctx.webServer.register(route));
		return () => {
			for (const dispose of disposers) dispose();
		};
	}, "whale-appearance: routes");
	ctx.on("session/event", (_session, event) => {
		if (event.type !== "activity/status") return;
		const data = typeof event.data === "object" && event.data !== null ? event.data : {};
		state.setActivity(data.phase);
	});
	ctx.on("session/disposed", () => {
		state.setActivity("idle");
	});
}
//#endregion
export { apply, inject, name };
