import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const root = fileURLToPath(new URL('../', import.meta.url))
process.chdir(root)
const [action, platform, ...extra] = process.argv.slice(2)
if (
  !['sync', 'run'].includes(action) ||
  !['android', 'ios'].includes(platform)
) {
  console.error(
    'Usage: node scripts/mobile.mjs <sync|run> <android|ios> [Capacitor options]',
  )
  process.exit(1)
}
if (!existsSync(resolve(root, platform))) {
  console.error(
    `The existing ${platform}/ project is not present in ${root}. Restore it here before running this command. No platform project has been created or replaced.`,
  )
  process.exit(1)
}
if (platform === 'ios' && process.platform !== 'darwin') {
  console.error(
    'Run iOS sync/run on the Mac containing Xcode and your existing ios/ project.',
  )
  process.exit(1)
}

function run(binary, args, env = process.env) {
  const result = spawnSync(binary, args, {
    cwd: root,
    env,
    stdio: 'inherit',
    windowsHide: true,
  })
  if (result.error) throw result.error
  if (result.status !== 0)
    throw new Error(
      `${args.join(' ')} failed (${result.status ?? result.signal}).`,
    )
}

// iOS ATS exceptions exist only during this local build/run, never in the
// committed production Info.plist. Restore the exact original even on failure.
let restorePlist = () => {}
process.on('SIGINT', () => {
  restorePlist()
  process.exit(130)
})
process.on('SIGTERM', () => {
  restorePlist()
  process.exit(143)
})
try {
  run(process.execPath, [
    'node_modules/vite/bin/vite.js',
    'build',
    '--mode',
    'mobile',
    '--outDir',
    'dist-mobile',
  ])
  if (platform === 'ios' && action === 'run') {
    const path = resolve(root, 'ios/App/App/Info.plist')
    const original = readFileSync(path)
    restorePlist = () => writeFileSync(path, original)
    const plist = '/usr/libexec/PlistBuddy'
    const set = (key, type, value) => {
      const existing =
        spawnSync(plist, ['-c', `Print :${key}`, path], { stdio: 'ignore' })
          .status === 0
      run(plist, [
        '-c',
        existing ? `Set :${key} ${value}` : `Add :${key} ${type} ${value}`,
        path,
      ])
    }
    if (
      spawnSync(plist, ['-c', 'Print :NSAppTransportSecurity', path], {
        stdio: 'ignore',
      }).status !== 0
    ) {
      run(plist, ['-c', 'Add :NSAppTransportSecurity dict', path])
    }
    set('NSAppTransportSecurity:NSAllowsLocalNetworking', 'bool', 'true')
    set(
      'NSAppTransportSecurity:NSAllowsArbitraryLoadsInWebContent',
      'bool',
      'true',
    )
    set(
      'NSLocalNetworkUsageDescription',
      'string',
      'Connect to the development HR server on your local network.',
    )
  }
  run(
    process.execPath,
    ['node_modules/@capacitor/cli/bin/capacitor', action, platform, ...extra],
    { ...process.env, CAPACITOR_MODE: 'mobile' },
  )
} catch (error) {
  console.error(error.message)
  process.exitCode = 1
} finally {
  restorePlist()
}
