import { defineConfig } from '@playwright/test'
import config from './playwright.config.js'

export default defineConfig({
  ...config,
  use: {
    ...config.use,
    channel: undefined,
    browserName: 'webkit',
    hasTouch: true,
    deviceScaleFactor: 2,
  },
})
