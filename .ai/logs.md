npm run build
24s
npm warn config production Use `--omit=dev` instead.
> think-marketplace@0.1.0 build
> next build
▲ Next.js 16.1.3 (Turbopack)
  Creating an optimized production build ...
✓ Compiled successfully in 9.1s
  Running TypeScript ...
  Collecting page data using 47 workers ...
Error: Failed to collect configuration for /_not-found

    at ignore-listed frames {
  [cause]: TypeError: Invalid URL
      at module evaluation (.next/server/chunks/ssr/[root-of-the-server]__31fe78f4._.js:1:4485)
      at instantiateModule (.next/server/chunks/ssr/[turbopack]_runtime.js:740:9)
      at getOrInstantiateModuleFromParent (.next/server/chunks/ssr/[turbopack]_runtime.js:763:12)
      at Context.esmImport [as i] (.next/server/chunks/ssr/[turbopack]_runtime.js:228:20)
      at module evaluation (.next/server/chunks/ssr/[root-of-the-server]__03d1af6c._.js:1:244)
      at instantiateModule (.next/server/chunks/ssr/[turbopack]_runtime.js:740:9)
      at getOrInstantiateModuleFromParent (.next/server/chunks/ssr/[turbopack]_runtime.js:763:12)
      at Context.commonJsRequire [as r] (.next/server/chunks/ssr/[turbopack]_runtime.js:249:12) {
    code: 'ERR_INVALID_URL',
    input: 'think-marketplace.up.railway.app'
  }
}
> Build error occurred
Error: Failed to collect page data for /_not-found

    at ignore-listed frames {
  type: 'Error'
}
ERROR: failed to build: failed to solve: process "npm run build" did not complete successfully: exit code: 1