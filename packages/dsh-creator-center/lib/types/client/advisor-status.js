export async function isManagedAdvisorHost(fetcher = globalThis.fetch) {
    try {
        const response = await fetcher('/api/whale-creator-center/advisor-status', { cache: 'no-store' });
        if (!response.ok)
            return false;
        const body = await response.json();
        return typeof body === 'object' && body !== null && body.managed === true;
    }
    catch {
        return false;
    }
}
