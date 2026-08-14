export function makeAdvisorStatusRoute({ managed }) {
    return {
        kind: 'exact',
        path: '/api/whale-creator-center/advisor-status',
        handler(req, res) {
            if (req.method !== 'GET') {
                res.writeHead(405);
                res.end();
                return;
            }
            const body = JSON.stringify({ managed });
            res.writeHead(200, {
                'content-type': 'application/json; charset=utf-8',
                'content-length': String(Buffer.byteLength(body)),
                'cache-control': 'no-store',
            });
            res.end(body);
        },
    };
}
