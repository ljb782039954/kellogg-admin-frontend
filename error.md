<<<<<<< HEAD
  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
16:56:43 [vite] Internal server error: [postcss] It looks like you're trying to use `tailwindcss` directly as a PostCSS plugin. The PostCSS plugin has moved to a separate package, so to continue using Tailwind CSS with PostCSS you'll need to install `@tailwindcss/postcss` and update your PostCSS configuration.
  Plugin: vite:css
  File: H:/Kellogg/adminApp/src/site-package/kellogg/styles/index.css:undefined:NaN
      at ft (H:\Kellogg\adminApp\node_modules\tailwindcss\dist\lib.js:38:1643)
      at LazyResult.runOnRoot (H:\Kellogg\adminApp\node_modules\postcss\lib\lazy-result.js:361:16)
      at LazyResult.runAsync (H:\Kellogg\adminApp\node_modules\postcss\lib\lazy-result.js:290:26)
      at LazyResult.async (H:\Kellogg\adminApp\node_modules\postcss\lib\lazy-result.js:192:30)
      at LazyResult.then (H:\Kellogg\adminApp\node_modules\postcss\lib\lazy-result.js:436:17)
16:56:43 [vite] (client) Pre-transform error: [postcss] It looks like you're trying to use `tailwindcss` directly as a PostCSS plugin. The PostCSS plugin has moved to a separate package, so to continue using Tailwind CSS with PostCSS you'll need to install `@tailwindcss/postcss` and update your PostCSS configuration.
  Plugin: vite:css
  File: H:/Kellogg/adminApp/src/site-package/kellogg/styles/index.css:undefined:NaN
2026-07-07T15:21:35.949Z	Initializing build environment...
2026-07-07T15:21:44.130Z	Success: Finished initializing build environment
2026-07-07T15:21:44.859Z	Cloning repository...
2026-07-07T15:21:47.850Z	Detected the following tools from environment: npm@10.9.2, nodejs@22.16.0
2026-07-07T15:21:47.853Z	Installing project dependencies: npm clean-install --progress=false
2026-07-07T15:21:51.061Z	npm error code EUSAGE
2026-07-07T15:21:51.061Z	npm error
2026-07-07T15:21:51.062Z	npm error `npm ci` can only install packages when your package.json and package-lock.json or npm-shrinkwrap.json are in sync. Please update your lock file with `npm install` before continuing.
2026-07-07T15:21:51.062Z	npm error
2026-07-07T15:21:51.062Z	npm error Missing: lightningcss-linux-x64-gnu@1.32.0 from lock file
2026-07-07T15:21:51.062Z	npm error
2026-07-07T15:21:51.062Z	npm error Clean install a project
2026-07-07T15:21:51.063Z	npm error
2026-07-07T15:21:51.063Z	npm error Usage:
2026-07-07T15:21:51.064Z	npm error npm ci
2026-07-07T15:21:51.064Z	npm error
2026-07-07T15:21:51.064Z	npm error Options:
2026-07-07T15:21:51.064Z	npm error [--install-strategy <hoisted|nested|shallow|linked>] [--legacy-bundling]
2026-07-07T15:21:51.065Z	npm error [--global-style] [--omit <dev|optional|peer> [--omit <dev|optional|peer> ...]]
2026-07-07T15:21:51.065Z	npm error [--include <prod|dev|optional|peer> [--include <prod|dev|optional|peer> ...]]
2026-07-07T15:21:51.065Z	npm error [--strict-peer-deps] [--foreground-scripts] [--ignore-scripts] [--no-audit]
2026-07-07T15:21:51.065Z	npm error [--no-bin-links] [--no-fund] [--dry-run]
2026-07-07T15:21:51.066Z	npm error [-w|--workspace <workspace-name> [-w|--workspace <workspace-name> ...]]
2026-07-07T15:21:51.066Z	npm error [-ws|--workspaces] [--include-workspace-root] [--install-links]
2026-07-07T15:21:51.066Z	npm error
2026-07-07T15:21:51.066Z	npm error aliases: clean-install, ic, install-clean, isntall-clean
2026-07-07T15:21:51.066Z	npm error
2026-07-07T15:21:51.067Z	npm error Run "npm help ci" for more info
2026-07-07T15:21:51.067Z	npm error A complete log of this run can be found in: /opt/buildhome/.npm/_logs/2026-07-07T15_21_49_166Z-debug-0.log
2026-07-07T15:21:51.140Z	Failed: error occurred while installing tools or dependencies
=======
src/site-package/kellogg/Management/pageBuilder/BlockPropsEditor.tsx:85:39 - error TS2352: Conversion of type 'Record<string, unknown>' to type 'TableContent' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.
  Type 'Record<string, unknown>' is missing the following properties from type 'TableContent': columns, rows

85       return <TablePropsEditor props={content as TableContent} onUpdate={onUpdate} />;
                                         ~~~~~~~~~~~~~~~~~~~~~~~

src/site-package/lilian/Management/pageBuilder/BlockPropsEditor.tsx:27:37 - error TS2352: Conversion of type 'Record<string, unknown>' to type 'TableContent' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.
  Type 'Record<string, unknown>' is missing the following properties from type 'TableContent': columns, rows

27     return <TablePropsEditor props={content as TableContent} onUpdate={onUpdate} />;
>>>>>>> refactor-v2
