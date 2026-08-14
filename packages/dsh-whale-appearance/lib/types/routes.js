import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
const API = '/api/whale-appearance';
const ASSET = '/whale-appearance/assets';
const PETS = ['off', 'whale-maid', 'abstract-whale'];
const SCALES = [0.8, 1, 1.2];
const ASSETS = [
    { name: 'whale-maid.jpg', mime: 'image/jpeg' },
    { name: 'abstract-whale.jpg', mime: 'image/jpeg' },
    { name: 'theme-reference.jpg', mime: 'image/jpeg' },
];
export function appearancePackageRoot(importMetaUrl) {
    return fileURLToPath(new URL('../', importMetaUrl));
}
function json(res, status, body) {
    res.writeHead(status, { 'content-type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(body));
}
function readJsonBody(req) {
    return new Promise((resolve, reject) => {
        let size = 0;
        const chunks = [];
        req.on('data', (chunk) => {
            size += chunk.length;
            if (size > 64 * 1024) {
                reject(new Error('body-too-large'));
                return;
            }
            chunks.push(chunk);
        });
        req.on('end', () => {
            try {
                const value = chunks.length === 0 ? {} : JSON.parse(Buffer.concat(chunks).toString('utf8'));
                resolve(typeof value === 'object' && value !== null ? value : {});
            }
            catch {
                reject(new Error('invalid-json'));
            }
        });
        req.on('error', reject);
    });
}
function patchFrom(body) {
    const patch = {};
    if (typeof body.themeEnabled === 'boolean')
        patch.themeEnabled = body.themeEnabled;
    if (body.pet !== undefined) {
        if (!PETS.includes(body.pet))
            throw new Error('invalid-pet');
        patch.pet = body.pet;
    }
    if (body.petScale !== undefined) {
        if (!SCALES.includes(body.petScale))
            throw new Error('invalid-pet-scale');
        patch.petScale = body.petScale;
    }
    if (body.petPosition !== undefined) {
        if (typeof body.petPosition !== 'object' || body.petPosition === null)
            throw new Error('invalid-pet-position');
        const raw = body.petPosition;
        if (typeof raw.right !== 'number' || typeof raw.bottom !== 'number')
            throw new Error('invalid-pet-position');
        patch.petPosition = { right: raw.right, bottom: raw.bottom };
    }
    return patch;
}
export function makeAppearanceRoutes(deps) {
    const { state, packageRoot } = deps;
    const apiRoutes = [
        {
            kind: 'exact',
            path: `${API}/state`,
            handler(req, res) {
                if (req.method !== 'GET')
                    return json(res, 405, { ok: false, error: 'method-not-allowed' });
                json(res, 200, state.snapshot());
            },
        },
        {
            kind: 'exact',
            path: `${API}/config`,
            handler(req, res) {
                if (req.method !== 'POST')
                    return json(res, 405, { ok: false, error: 'method-not-allowed' });
                return readJsonBody(req).then(body => json(res, 200, state.update(patchFrom(body))), error => json(res, 400, { ok: false, error: error instanceof Error ? error.message : String(error) })).catch(error => {
                    json(res, 400, { ok: false, error: error instanceof Error ? error.message : String(error) });
                });
            },
        },
    ];
    const assetRoutes = ASSETS.map(file => ({
        kind: 'exact',
        path: `${ASSET}/${file.name}`,
        handler(req, res) {
            if (req.method !== 'GET' && req.method !== 'HEAD') {
                res.writeHead(405);
                res.end();
                return;
            }
            return readFile(join(packageRoot, 'assets', 'prototype', file.name)).then(body => {
                res.writeHead(200, {
                    'content-type': file.mime,
                    'content-length': String(body.byteLength),
                    'cache-control': 'no-cache',
                });
                res.end(req.method === 'HEAD' ? undefined : body);
            }, () => {
                res.writeHead(404);
                res.end();
            });
        },
    }));
    return [...apiRoutes, ...assetRoutes];
}
