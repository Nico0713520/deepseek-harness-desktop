import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

test('extension academy exposes curated repositories and a safe tutorial', async () => {
  const html = await readFile(new URL('../src/extensions.html', import.meta.url), 'utf8')
  assert.match(html, /github\.com\/deepseek-ai\/deepseek-harness/)
  assert.match(html, /github\.com\/zhu1090093659\/dsh-web-ui/)
  assert.match(html, /dsh plugin --profile web add/)
  assert.match(html, /Content-Security-Policy/)
  assert.doesNotMatch(html, /nodeIntegration/)
})
