import test from 'node:test'
import assert from 'node:assert/strict'
import { startSpec, runSpec } from '../src/host.js'

const done = { exitCode: 0, signal: null, stdout: { text: 'ok' }, stderr: { text: '' } }

test('DSH ≥0.1.7 shell: execute() handle drives both streaming and foreground runs', async () => {
  const handle = { status: 'completed', exitCode: 0, done: Promise.resolve(), readOutput: () => ({ delta: '', lossy: false }), result: async () => done }
  const shell = { resolve: (r) => r, execute: async () => handle }
  assert.equal(await startSpec(shell, {}), handle)
  assert.deepEqual(await runSpec(shell, {}), done)
})

test('DSH ≤0.1.6 shell: falls back to start()/run()', async () => {
  const proc = { status: 'completed', exitCode: 0 }
  const shell = { start: () => proc, run: async () => done }
  assert.equal(await startSpec(shell, {}), proc)
  assert.deepEqual(await runSpec(shell, {}), done)
})

test('shell without any spawn method fails loudly', async () => {
  await assert.rejects(startSpec({}, {}), TypeError)
  await assert.rejects(runSpec({}, {}), TypeError)
})
