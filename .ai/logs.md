Console Error


A tree hydrated but some attributes of the server rendered HTML didn't match the client properties. This won't be patched up. This can happen if a SSR-ed Client Component used:
- A server/client branch `if (typeof window !== 'undefined')`.
- Variable input such as `Date.now()` or `Math.random()` which changes each time it's called.
- Date formatting in a user's locale which doesn't match the server.
- External changing data without sending a snapshot of it along with the HTML.
- Invalid HTML tag nesting.

It can also happen if the client has a browser extension installed which messes with the HTML before React loaded.

See more info here: https://nextjs.org/docs/messages/react-hydration-error


  ...
    <InnerLayoutRouter url="/" tree={[...]} params={{}} cacheNode={{rsc:<Fragment>, ...}} segmentPath={[...]} ...>
      <SegmentViewNode type="page" pagePath="page.tsx">
        <SegmentTrieNode>
        <HomePage>
          <Layout>
            <div className="flex min-h...">
              ...
                <header className="sticky top..." style={{}} ref={function useMotionRef.useCallback}>
                  <nav className="mx-auto fl..." aria-label="Main navig...">
                    <div className="flex lg:fl...">
                      <LinkComponent href="/" className="-m-1.5 p-1...">
                        <a className="-m-1.5 p-1..." ref={function} onClick={function onClick} ...>
                          ...
                            <div style={{}} ref={function useMotionRef.useCallback}>
                              <img
                                alt=""
                                fetchPriority={undefined}
                                loading={undefined}
                                width={32}
                                height={36}
                                decoding="async"
                                data-nimg="1"
                                className="h-9 w-auto"
                                style={{color:"transparent"}}
                                sizes={undefined}
                                srcSet={undefined}
+                               src="/think-brainfist-darkmode-mode.svg"
-                               src="/think-brainfist-light-mode.svg"
                                ref={function}
                                onLoad={function onLoad}
                                onError={function onError}
                              >
                              ...
                          <img
                            alt="Think Marketplace"
                            fetchPriority={undefined}
                            loading={undefined}
                            width={120}
                            height={16}
                            decoding="async"
                            data-nimg="1"
                            className="h-4 w-auto ml-1"
                            style={{color:"transparent"}}
                            sizes={undefined}
                            srcSet={undefined}
+                           src="/think-marketplace-wordmark-dark-mode-white.svg"
-                           src="/think-marketplace-wordmark-light-mode.svg"
                            ref={function}
                            onLoad={function onLoad}
                            onError={function onError}
                          >
                          ...
                    ...
              <main>
              <Footer>
                <footer className="border-t b..." aria-labelledby="footer-hea...">
                  <h2>
                  <div className="mx-auto ma...">
                    <div className="grid grid-...">
                      <div className="col-span-2...">
                        <LinkComponent href="/" className="flex items...">
                          <a className="flex items..." ref={function} onClick={function onClick} ...>
                            <img
                              alt=""
                              fetchPriority={undefined}
                              loading="lazy"
                              width={32}
                              height={36}
                              decoding="async"
                              data-nimg="1"
                              className="h-9 w-auto"
                              style={{color:"transparent"}}
                              sizes={undefined}
                              srcSet={undefined}
+                             src="/think-brainfist-darkmode-mode.svg"
-                             src="/think-brainfist-light-mode.svg"
                              ref={function}
                              onLoad={function onLoad}
                              onError={function onError}
                            >
                            <img
                              alt="Think Marketplace"
                              fetchPriority={undefined}
                              loading="lazy"
                              width={120}
                              height={16}
                              decoding="async"
                              data-nimg="1"
                              className="h-4 w-auto ml-1"
                              style={{color:"transparent"}}
                              sizes={undefined}
                              srcSet={undefined}
+                             src="/think-marketplace-wordmark-dark-mode-white.svg"
-                             src="/think-marketplace-wordmark-light-mode.svg"
                              ref={function}
                              onLoad={function onLoad}
                              onError={function onError}
                            >
                        ...
                      ...
                    ...
      ...
Call Stack
22

Show 1 ignore-listed frame(s)
createConsoleError
file:///mnt/d/Clients/AI%20Layer%20Labs/ThinkOS/think-marketplace/.next/dev/static/chunks/node_modules_next_dist_f3530cac._.js (2199:71)
handleConsoleError
file:///mnt/d/Clients/AI%20Layer%20Labs/ThinkOS/think-marketplace/.next/dev/static/chunks/node_modules_next_dist_f3530cac._.js (2980:54)
console.error
file:///mnt/d/Clients/AI%20Layer%20Labs/ThinkOS/think-marketplace/.next/dev/static/chunks/node_modules_next_dist_f3530cac._.js (3124:57)
<unknown>
file:///mnt/d/Clients/AI%20Layer%20Labs/ThinkOS/think-marketplace/.next/dev/static/chunks/node_modules_next_dist_compiled_react-dom_1e674e59._.js (3469:25)
runWithFiberInDEV
file:///mnt/d/Clients/AI%20Layer%20Labs/ThinkOS/think-marketplace/.next/dev/static/chunks/node_modules_next_dist_compiled_react-dom_1e674e59._.js (965:74)
emitPendingHydrationWarnings
file:///mnt/d/Clients/AI%20Layer%20Labs/ThinkOS/think-marketplace/.next/dev/static/chunks/node_modules_next_dist_compiled_react-dom_1e674e59._.js (3468:13)
completeWork
file:///mnt/d/Clients/AI%20Layer%20Labs/ThinkOS/think-marketplace/.next/dev/static/chunks/node_modules_next_dist_compiled_react-dom_1e674e59._.js (6897:102)
runWithFiberInDEV
file:///mnt/d/Clients/AI%20Layer%20Labs/ThinkOS/think-marketplace/.next/dev/static/chunks/node_modules_next_dist_compiled_react-dom_1e674e59._.js (965:131)
completeUnitOfWork
file:///mnt/d/Clients/AI%20Layer%20Labs/ThinkOS/think-marketplace/.next/dev/static/chunks/node_modules_next_dist_compiled_react-dom_1e674e59._.js (9627:23)
performUnitOfWork
file:///mnt/d/Clients/AI%20Layer%20Labs/ThinkOS/think-marketplace/.next/dev/static/chunks/node_modules_next_dist_compiled_react-dom_1e674e59._.js (9564:28)
workLoopConcurrentByScheduler
file:///mnt/d/Clients/AI%20Layer%20Labs/ThinkOS/think-marketplace/.next/dev/static/chunks/node_modules_next_dist_compiled_react-dom_1e674e59._.js (9558:58)
renderRootConcurrent
file:///mnt/d/Clients/AI%20Layer%20Labs/ThinkOS/think-marketplace/.next/dev/static/chunks/node_modules_next_dist_compiled_react-dom_1e674e59._.js (9541:71)
performWorkOnRoot
file:///mnt/d/Clients/AI%20Layer%20Labs/ThinkOS/think-marketplace/.next/dev/static/chunks/node_modules_next_dist_compiled_react-dom_1e674e59._.js (9068:150)
performWorkOnRootViaSchedulerTask
file:///mnt/d/Clients/AI%20Layer%20Labs/ThinkOS/think-marketplace/.next/dev/static/chunks/node_modules_next_dist_compiled_react-dom_1e674e59._.js (10230:9)
MessagePort.performWorkUntilDeadline
file:///mnt/d/Clients/AI%20Layer%20Labs/ThinkOS/think-marketplace/.next/dev/static/chunks/node_modules_next_dist_compiled_a0e4c7b4._.js (2647:64)
img
<anonymous>
<unknown>
file:///mnt/d/Clients/AI%20Layer%20Labs/ThinkOS/think-marketplace/.next/dev/static/chunks/node_modules_01267223._.js (3939:46)
<unknown>
file:///mnt/d/Clients/AI%20Layer%20Labs/ThinkOS/think-marketplace/.next/dev/static/chunks/node_modules_01267223._.js (4055:47)
Header
file:///mnt/d/Clients/AI%20Layer%20Labs/ThinkOS/think-marketplace/.next/dev/static/chunks/src_components_a6c17165._.js (508:245)
Layout
about:/Server/file:///mnt/d/Clients/AI%20Layer%20Labs/ThinkOS/think-marketplace/.next/dev/server/chunks/ssr/_d79164d4._.js (129:264)
HomePage
about:/Server/file:///mnt/d/Clients/AI%20Layer%20Labs/ThinkOS/think-marketplace/.next/dev/server/chunks/ssr/%5Broot-of-the-server%5D__b8033262._.js (919:263)