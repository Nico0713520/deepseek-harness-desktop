import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

test('startup screen is branded and keeps a minimal loading state', async () => {
  const html = await readFile(new URL('../src/startup.html', import.meta.url), 'utf8')

  assert.match(html, /<title>DeepSeek Harness Whale Desktop<\/title>/)
  assert.match(html, /trayTemplate@2x\.png/)
  assert.match(html, /class="progress"/)
  assert.match(html, /Whale Desktop 正在启动 DeepSeek Harness/)
  assert.doesNotMatch(html, /<h1|<p/)
})
