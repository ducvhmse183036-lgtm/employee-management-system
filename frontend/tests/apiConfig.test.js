import assert from 'node:assert/strict'
import { test } from 'node:test'
import { readFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { resolveApiUrl } from '../src/config/apiConfig.js'

test('development keeps relative API and upload requests behind Vite proxy', () => {
  assert.equal(resolveApiUrl('/api/employees'), '/api/employees')
  assert.equal(
    resolveApiUrl('/uploads/employee-photos/photo.png'),
    '/uploads/employee-photos/photo.png',
  )
})

test('API calls and photos resolve against the same explicitly configured origin', () => {
  const origin = 'https://backend.test'
  assert.equal(
    resolveApiUrl('/api/employees/search?keyword=Jane%20Doe', origin, {
      production: true,
    }),
    `${origin}/api/employees/search?keyword=Jane%20Doe`,
  )
  assert.equal(
    resolveApiUrl('/uploads/employee-photos/photo.png', origin, {
      production: true,
    }),
    `${origin}/uploads/employee-photos/photo.png`,
  )
  assert.equal(
    resolveApiUrl('/api/health', 'http://localhost:8080'),
    'http://localhost:8080/api/health',
  )
})

test('production requires a real HTTPS configuration without a path or credentials', () => {
  for (const origin of [
    '',
    'http://localhost:8080',
    'https://YOUR-BACKEND-DOMAIN.example.com',
    'https://user:password@backend.test',
    'https://backend.test/api',
    'https://backend.test?token=secret',
  ]) {
    assert.throws(() =>
      resolveApiUrl('/api/employees', origin, { production: true }),
    )
  }
})

test('resource paths cannot redirect bearer tokens to an arbitrary origin', () => {
  for (const path of [
    'https://untrusted.test/photo.png',
    '//untrusted.test/photo.png',
    '/uploads/../../other',
    '/api/\\untrusted.test',
    '/other/image',
    '/api/../other',
    '/uploads/%2e%2e/other',
  ]) {
    assert.throws(() => resolveApiUrl(path, 'https://backend.test'))
  }
})

test('mobile build allows LAN HTTP but the normal production build still rejects it', () => {
  const lan = 'http://192.168.1.190:8080'
  const options = { production: true, mode: 'mobile' }
  assert.equal(
    resolveApiUrl('/api/employees', lan, options),
    `${lan}/api/employees`,
  )
  assert.equal(
    resolveApiUrl('/uploads/employee-photos/photo.jpg', lan, options),
    `${lan}/uploads/employee-photos/photo.jpg`,
  )
  assert.throws(() =>
    resolveApiUrl('/api/employees', lan, {
      production: true,
      mode: 'production',
    }),
  )
  assert.throws(() => resolveApiUrl('/api/employees', '', options))
})

test('Capacitor mobile settings are opt-in and production equals the original JSON config', () => {
  const load = (mode) => {
    const result = spawnSync(
      process.execPath,
      ['-e', "console.log(JSON.stringify(require('./capacitor.config.js')))"],
      {
        env: { ...process.env, CAPACITOR_MODE: mode },
        encoding: 'utf8',
      },
    )
    assert.equal(result.status, 0, result.stderr)
    return JSON.parse(result.stdout)
  }
  const production = JSON.parse(readFileSync('capacitor.config.json', 'utf8'))
  assert.deepEqual(load(''), production)
  const mobile = load('mobile')
  assert.equal(mobile.webDir, 'dist-mobile')
  assert.equal(mobile.server.cleartext, true)
  assert.equal(mobile.android.allowMixedContent, true)
  assert.equal(mobile.server.url, undefined)
})
