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
//#region src/index.ts
const name = "whale-creator-center";
const inject = ["webServer"];
function apply(ctx) {
	const host = ctx;
	const route = makeAdvisorStatusRoute({ managed: process.env.WHALE_ADVISOR_MANAGED === "1" });
	host.effect(() => host.webServer.register(route), "whale-creator-center: advisor status");
}
//#endregion
export { apply, inject, name };
