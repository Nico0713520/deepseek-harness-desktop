import { clientBundle } from '../../shared/tsdown.client.ts'

export default clientBundle('@whale-desktop/dsh-whale-appearance', ['src/index.ts'], {
  libExternal: ['@deepseek-ai/dsh-host-webserver', '@deepseek-ai/dsh-session'],
})
