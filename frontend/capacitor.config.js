import { readFileSync } from 'node:fs'

// Keep the existing JSON as the unchanged production configuration.
// Capacitor CLI supports JS config; named exports are read by its require() loader.
const base = JSON.parse(
  readFileSync(new URL('./capacitor.config.json', import.meta.url), 'utf8'),
)
const mobile = process.env.CAPACITOR_MODE === 'mobile'

export const appId = base.appId
export const appName = base.appName
export const webDir = mobile ? 'dist-mobile' : base.webDir
export const ios = base.ios
export const android = mobile
  ? { ...base.android, allowMixedContent: true }
  : base.android
export const server = mobile ? { ...base.server, cleartext: true } : base.server
