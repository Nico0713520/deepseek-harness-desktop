import { mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { isAbsolute, join, relative, resolve } from 'node:path';
export const USER_EXTENSION_OWNER = 'whale-extension-center';
export const USER_EXTENSION_REGISTRY = 'whale-user-extensions.json';
function isRecord(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}
function isKind(value) {
    return value === 'skill' || value === 'plugin';
}
function normalizeRecord(value) {
    if (!isRecord(value))
        return undefined;
    const requiredStrings = ['id', 'title', 'category', 'summary', 'repositoryUrl', 'localPath', 'installedAt'];
    if (!requiredStrings.every(key => typeof value[key] === 'string' && value[key].length > 0))
        return undefined;
    if (!isKind(value.kind) || value.managedBy !== USER_EXTENSION_OWNER || typeof value.enabled !== 'boolean')
        return undefined;
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
        ...(value.localTestOnly === true ? { localTestOnly: true } : {}),
    };
}
export function userExtensionRegistryPath(dshHome) {
    return join(dshHome, USER_EXTENSION_REGISTRY);
}
export function loadUserExtensions(dshHome) {
    try {
        const parsed = JSON.parse(readFileSync(userExtensionRegistryPath(dshHome), 'utf8'));
        if (!Array.isArray(parsed))
            return [];
        return parsed.map(normalizeRecord).filter((item) => item !== undefined);
    }
    catch {
        return [];
    }
}
export function saveUserExtensions(dshHome, records) {
    mkdirSync(dshHome, { recursive: true });
    const target = userExtensionRegistryPath(dshHome);
    const temporary = `${target}.tmp`;
    writeFileSync(temporary, JSON.stringify(records, null, 2), 'utf8');
    renameSync(temporary, target);
}
function json(res, status, body) {
    const encoded = JSON.stringify(body);
    res.writeHead(status, {
        'content-type': 'application/json; charset=utf-8',
        'cache-control': 'no-store',
        'content-length': String(Buffer.byteLength(encoded)),
    });
    res.end(encoded);
}
function readJsonBody(req) {
    return new Promise((resolveBody, reject) => {
        const chunks = [];
        let size = 0;
        req.on('data', (chunk) => {
            size += chunk.byteLength;
            if (size > 16 * 1024) {
                reject(new Error('body-too-large'));
                return;
            }
            chunks.push(chunk);
        });
        req.on('end', () => {
            try {
                const parsed = chunks.length === 0 ? {} : JSON.parse(Buffer.concat(chunks).toString('utf8'));
                resolveBody(isRecord(parsed) ? parsed : {});
            }
            catch {
                reject(new Error('invalid-json'));
            }
        });
        req.on('error', reject);
    });
}
function idFromPath(pathname) {
    const prefix = '/api/whale-creator-center/user-extensions/';
    if (!pathname.startsWith(prefix))
        return undefined;
    const id = pathname.slice(prefix.length);
    return id.length > 0 && !id.includes('/') ? decodeURIComponent(id) : undefined;
}
function isSafeUserPath(dshHome, localPath) {
    if (!isAbsolute(localPath))
        return false;
    const root = resolve(dshHome);
    const allowedRoots = [resolve(join(root, 'skills')), resolve(join(root, 'user-extensions'))];
    const candidate = resolve(localPath);
    return allowedRoots.some(allowed => {
        const child = relative(allowed, candidate);
        return child !== '' && child !== '..' && !child.startsWith(`..${process.platform === 'win32' ? '\\' : '/'}`) && !isAbsolute(child);
    });
}
export function makeUserExtensionRoutes(dshHome) {
    const collectionPath = '/api/whale-creator-center/user-extensions';
    const itemPath = `${collectionPath}/`;
    return [
        {
            kind: 'exact',
            path: collectionPath,
            handler(req, res) {
                if (req.method !== 'GET')
                    return json(res, 405, { ok: false, error: 'method-not-allowed' });
                json(res, 200, { ok: true, extensions: loadUserExtensions(dshHome) });
            },
        },
        {
            kind: 'prefix',
            path: itemPath,
            handler(req, res) {
                const id = idFromPath(new URL(req.url ?? '/', 'http://dsh.local').pathname);
                if (id === undefined)
                    return json(res, 404, { ok: false, error: 'extension-not-found' });
                const records = loadUserExtensions(dshHome);
                const record = records.find(item => item.id === id);
                if (record === undefined)
                    return json(res, 404, { ok: false, error: 'extension-not-found' });
                if (req.method === 'PATCH') {
                    return readJsonBody(req).then(body => {
                        const enabled = body.enabled;
                        if (typeof enabled !== 'boolean')
                            return json(res, 400, { ok: false, error: 'invalid-enabled' });
                        const next = records.map(item => item.id === id ? { ...item, enabled } : item);
                        saveUserExtensions(dshHome, next);
                        json(res, 200, { ok: true, extension: next.find(item => item.id === id) });
                    }).catch(error => json(res, 400, { ok: false, error: error instanceof Error ? error.message : String(error) }));
                }
                if (req.method !== 'DELETE')
                    return json(res, 405, { ok: false, error: 'method-not-allowed' });
                if (record.kind === 'plugin') {
                    saveUserExtensions(dshHome, records.filter(item => item.id !== id));
                    return json(res, 200, { ok: true, removed: id, localFilesRetained: true });
                }
                if (!isSafeUserPath(dshHome, record.localPath)) {
                    return json(res, 409, { ok: false, error: 'extension-path-is-not-user-owned' });
                }
                try {
                    rmSync(record.localPath, { recursive: true, force: true });
                    saveUserExtensions(dshHome, records.filter(item => item.id !== id));
                    json(res, 200, { ok: true, removed: id });
                }
                catch (error) {
                    json(res, 500, { ok: false, error: error instanceof Error ? error.message : String(error) });
                }
            },
        },
    ];
}
