# Local web and Capacitor development

The application uses real Spring Boot endpoints and SQL Server data. API calls and authenticated employee photos share `src/config/apiConfig.js`, which reads `import.meta.env.VITE_API_BASE_URL`. Bearer-token handling is unchanged.

## Environment files

| File | Value | Selected by |
| --- | --- | --- |
| `.env.development` | `http://localhost:8080` | `npm run dev` |
| `.env.mobile` | `http://192.168.1.190:8080` | `npm run build:mobile` and the mobile Capacitor commands |
| `.env.example` | Existing production HTTPS placeholder, with local examples in comments | Documentation only; not loaded automatically |

These files contain only public addresses, no secrets. Personal overrides can go in ignored `.env.development.local` or `.env.mobile.local`. Existing process environment variables take precedence, so unset an old `VITE_API_BASE_URL` before changing modes. Restart Vite or rebuild/sync after changing an address.

## Web development

```sh
npm run dev
```

Open `http://localhost:5173`. Requests go directly to `http://localhost:8080`, as requested. The backend must allow browser CORS from `http://localhost:5173`, including Authorization/Content-Type headers and OPTIONS preflights. If the backend does not allow this origin, a frontend-only alternative is to set `VITE_API_BASE_URL=` in `.env.development.local`; the existing Vite proxy then handles API and photo requests. No backend files were changed.

## Mobile build, sync and run

Run these from `frontend`. On PowerShell use `npm.cmd` if execution policy blocks `npm`.

```sh
# Build only, using .env.mobile. Output is dist-mobile, separate from production dist.
npm run build:mobile

# Android: build and sync the existing android/ project
npm run cap:sync:mobile -- android
# Build, sync, install and run on a selected device/emulator
npm run cap:run:mobile -- android

# iOS: run on a Mac with Xcode and the existing ios/ project
npm run cap:sync:mobile -- ios
npm run cap:run:mobile -- ios

# Optional: choose a target explicitly
npm run cap:run:mobile -- android --target DEVICE_ID
```

The sync/run wrappers build with `--mode mobile`, then launch Capacitor with `CAPACITOR_MODE=mobile`. Do not use plain `npx cap sync` after a mobile build: it selects the original production configuration and `dist` instead. Each `cap:run:mobile` command already builds and syncs, so the separate build/sync commands are optional.

This checkout currently contains Capacitor configuration but no `android/` or `ios/` folders. The wrapper stops with a clear message if the selected project is absent; it does not recreate or replace your existing native project. Restore/copy your existing platform folder into `frontend` before syncing. Matching `@capacitor/core`, `@capacitor/android`, `@capacitor/ios`, and CLI 8.4.3 packages are installed.

## Local HTTP access

- `capacitor.config.js` reads the unchanged `capacitor.config.json` as its production baseline. Only mobile commands enable Android `server.cleartext` and `android.allowMixedContent`. The bundled UI is loaded locally; `server.url` is not set to the API server.
- For iOS **run**, the wrapper temporarily adds local-network permission text and development-only ATS allowances to `ios/App/App/Info.plist`, builds/installs the app, then restores the original plist. Use the run wrapper to test HTTP: sync alone does not leave ATS exceptions in the source plist. Custom native project paths/build configurations need corresponding adjustments to the wrapper.
- Phone/tablet and PC must be on the same reachable LAN. Spring Boot must listen on the LAN interface and Windows Firewall must permit inbound TCP 8080. No firewall or backend settings were changed.
- WebView fetch still obeys CORS. The backend needs to permit the native origins (normally `capacitor://localhost` on iOS and `https://localhost` on Android), Authorization and Content-Type headers, and OPTIONS. These permissions must cover both `/api/**` and `/uploads/**`. Native cleartext settings alone do not solve CORS.
- On iOS, allow the app's Local Network permission if prompted.

## Production remains separate

`npm run build`, `npm run cap:sync`, the production HTTPS requirement, `.env.example` production placeholder, and `vercel.json` retain their previous behavior. Mobile HTTP is allowed only for the explicit `mobile` Vite mode. Run the normal build/sync before a release to replace the native mobile bundle and remove generated Android development settings. Do not ship a local mobile build.

## Verification

```sh
npm run test:config
npm run lint
npm run build:mobile
npm run build
```

Native installation cannot be verified without the actual platform folders and platform SDKs. LAN reachability alone does not prove authenticated access or CORS is configured.

References: [Vite modes](https://vite.dev/guide/env-and-mode), [Capacitor HTTP configuration](https://capacitorjs.com/docs/config), [Apple WebView ATS setting](https://developer.apple.com/documentation/bundleresources/information-property-list/nsapptransportsecurity/nsallowsarbitraryloadsinwebcontent).

Current connectivity check: the LAN endpoint responds, but OPTIONS preflights for both `capacitor://localhost` and `http://localhost:5173` returned HTTP 403 without CORS allow headers. Real authenticated data access is not verified. Web dev can use the documented proxy fallback; native fetch requires the backend CORS policy to allow its origin.
