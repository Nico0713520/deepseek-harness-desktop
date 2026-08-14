type StatusFetcher = (input: string, init?: { cache?: RequestCache }) => Promise<{
  ok: boolean
  json(): Promise<unknown>
}>

export async function isManagedAdvisorHost(fetcher: StatusFetcher = globalThis.fetch): Promise<boolean> {
  try {
    const response = await fetcher('/api/whale-creator-center/advisor-status', { cache: 'no-store' })
    if (!response.ok) return false
    const body = await response.json()
    return typeof body === 'object' && body !== null && (body as { managed?: unknown }).managed === true
  } catch {
    return false
  }
}
