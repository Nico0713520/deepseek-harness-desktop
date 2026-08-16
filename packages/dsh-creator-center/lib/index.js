import { homedir } from "node:os";
import { isAbsolute, join, relative, resolve } from "node:path";
import { mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
//#region src/status.ts
function makeAdvisorStatusRoute({ managed }) {
	return {
		kind: "exact",
		path: "/api/whale-creator-center/advisor-status",
		handler(req, res) {
			if (req.method !== "GET") {
				res.writeHead(405);
				res.end();
				return;
			}
			const body = JSON.stringify({ managed });
			res.writeHead(200, {
				"content-type": "application/json; charset=utf-8",
				"content-length": String(Buffer.byteLength(body)),
				"cache-control": "no-store"
			});
			res.end(body);
		}
	};
}
//#endregion
//#region src/extensions.ts
const USER_EXTENSION_OWNER = "whale-extension-center";
const USER_EXTENSION_REGISTRY = "whale-user-extensions.json";
function isRecord(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}
function isKind(value) {
	return value === "skill" || value === "plugin";
}
function normalizeRecord(value) {
	if (!isRecord(value)) return void 0;
	if (![
		"id",
		"title",
		"category",
		"summary",
		"repositoryUrl",
		"localPath",
		"installedAt"
	].every((key) => typeof value[key] === "string" && value[key].length > 0)) return void 0;
	if (!isKind(value.kind) || value.managedBy !== "whale-extension-center" || typeof value.enabled !== "boolean") return void 0;
	return {
		id: value.id,
		title: value.title,
		kind: value.kind,
		category: value.category,
		summary: value.summary,
		repositoryUrl: value.repositoryUrl,
		localPath: value.localPath,
		managedBy: USER_EXTENSION_OWNER,
		installedAt: value.installedAt,
		enabled: value.enabled,
		...value.localTestOnly === true ? { localTestOnly: true } : {}
	};
}
function userExtensionRegistryPath(dshHome) {
	return join(dshHome, USER_EXTENSION_REGISTRY);
}
function loadUserExtensions(dshHome) {
	try {
		const parsed = JSON.parse(readFileSync(userExtensionRegistryPath(dshHome), "utf8"));
		if (!Array.isArray(parsed)) return [];
		return parsed.map(normalizeRecord).filter((item) => item !== void 0);
	} catch {
		return [];
	}
}
function saveUserExtensions(dshHome, records) {
	mkdirSync(dshHome, { recursive: true });
	const target = userExtensionRegistryPath(dshHome);
	const temporary = `${target}.tmp`;
	writeFileSync(temporary, JSON.stringify(records, null, 2), "utf8");
	renameSync(temporary, target);
}
function json(res, status, body) {
	const encoded = JSON.stringify(body);
	res.writeHead(status, {
		"content-type": "application/json; charset=utf-8",
		"cache-control": "no-store",
		"content-length": String(Buffer.byteLength(encoded))
	});
	res.end(encoded);
}
function readJsonBody(req) {
	return new Promise((resolveBody, reject) => {
		const chunks = [];
		let size = 0;
		req.on("data", (chunk) => {
			size += chunk.byteLength;
			if (size > 16 * 1024) {
				reject(/* @__PURE__ */ new Error("body-too-large"));
				return;
			}
			chunks.push(chunk);
		});
		req.on("end", () => {
			try {
				const parsed = chunks.length === 0 ? {} : JSON.parse(Buffer.concat(chunks).toString("utf8"));
				resolveBody(isRecord(parsed) ? parsed : {});
			} catch {
				reject(/* @__PURE__ */ new Error("invalid-json"));
			}
		});
		req.on("error", reject);
	});
}
function idFromPath(pathname) {
	if (!pathname.startsWith("/api/whale-creator-center/user-extensions/")) return void 0;
	const id = pathname.slice(42);
	return id.length > 0 && !id.includes("/") ? decodeURIComponent(id) : void 0;
}
function isSafeUserPath(dshHome, localPath) {
	if (!isAbsolute(localPath)) return false;
	const root = resolve(dshHome);
	const allowedRoots = [resolve(join(root, "skills")), resolve(join(root, "user-extensions"))];
	const candidate = resolve(localPath);
	return allowedRoots.some((allowed) => {
		const child = relative(allowed, candidate);
		return child !== "" && child !== ".." && !child.startsWith(`..${process.platform === "win32" ? "\\" : "/"}`) && !isAbsolute(child);
	});
}
function makeUserExtensionRoutes(dshHome) {
	const collectionPath = "/api/whale-creator-center/user-extensions";
	return [{
		kind: "exact",
		path: collectionPath,
		handler(req, res) {
			if (req.method !== "GET") return json(res, 405, {
				ok: false,
				error: "method-not-allowed"
			});
			json(res, 200, {
				ok: true,
				extensions: loadUserExtensions(dshHome)
			});
		}
	}, {
		kind: "prefix",
		path: `${collectionPath}/`,
		handler(req, res) {
			const id = idFromPath(new URL(req.url ?? "/", "http://dsh.local").pathname);
			if (id === void 0) return json(res, 404, {
				ok: false,
				error: "extension-not-found"
			});
			const records = loadUserExtensions(dshHome);
			const record = records.find((item) => item.id === id);
			if (record === void 0) return json(res, 404, {
				ok: false,
				error: "extension-not-found"
			});
			if (req.method === "PATCH") return readJsonBody(req).then((body) => {
				const enabled = body.enabled;
				if (typeof enabled !== "boolean") return json(res, 400, {
					ok: false,
					error: "invalid-enabled"
				});
				const next = records.map((item) => item.id === id ? {
					...item,
					enabled
				} : item);
				saveUserExtensions(dshHome, next);
				json(res, 200, {
					ok: true,
					extension: next.find((item) => item.id === id)
				});
			}).catch((error) => json(res, 400, {
				ok: false,
				error: error instanceof Error ? error.message : String(error)
			}));
			if (req.method !== "DELETE") return json(res, 405, {
				ok: false,
				error: "method-not-allowed"
			});
			if (record.kind === "plugin") {
				saveUserExtensions(dshHome, records.filter((item) => item.id !== id));
				return json(res, 200, {
					ok: true,
					removed: id,
					localFilesRetained: true
				});
			}
			if (!isSafeUserPath(dshHome, record.localPath)) return json(res, 409, {
				ok: false,
				error: "extension-path-is-not-user-owned"
			});
			try {
				rmSync(record.localPath, {
					recursive: true,
					force: true
				});
				saveUserExtensions(dshHome, records.filter((item) => item.id !== id));
				json(res, 200, {
					ok: true,
					removed: id
				});
			} catch (error) {
				json(res, 500, {
					ok: false,
					error: error instanceof Error ? error.message : String(error)
				});
			}
		}
	}];
}
//#endregion
//#region src/index.ts
const name = "whale-creator-center";
const inject = ["webServer"];
function apply(ctx) {
	const host = ctx;
	const route = makeAdvisorStatusRoute({ managed: process.env.WHALE_ADVISOR_MANAGED === "1" });
	const userExtensionRoutes = makeUserExtensionRoutes(process.env.DSH_HOME ?? join(homedir(), ".dsh"));
	host.effect(() => {
		const disposers = [host.webServer.register(route), ...userExtensionRoutes.map((item) => host.webServer.register(item))];
		return () => {
			for (const dispose of disposers) dispose();
		};
	}, "whale-creator-center: advisor and user extension routes");
}
//#endregion
export { apply, inject, name };
