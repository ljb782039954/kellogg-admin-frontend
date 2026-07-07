2026-07-07T10:29:18.490Z	Initializing build environment...
2026-07-07T10:29:21.088Z	Success: Finished initializing build environment
2026-07-07T10:29:21.531Z	Cloning repository...
2026-07-07T10:29:22.979Z	Detected the following tools from environment: npm@10.9.2, nodejs@22.16.0
2026-07-07T10:29:22.982Z	Installing project dependencies: npm clean-install --progress=false
2026-07-07T10:29:36.087Z	
2026-07-07T10:29:36.087Z	added 356 packages, and audited 357 packages in 13s
2026-07-07T10:29:36.087Z	
2026-07-07T10:29:36.087Z	63 packages are looking for funding
2026-07-07T10:29:36.087Z	  run `npm fund` for details
2026-07-07T10:29:36.127Z	
2026-07-07T10:29:36.127Z	11 vulnerabilities (2 low, 3 moderate, 6 high)
2026-07-07T10:29:36.127Z	
2026-07-07T10:29:36.127Z	To address all issues, run:
2026-07-07T10:29:36.127Z	  npm audit fix
2026-07-07T10:29:36.127Z	
2026-07-07T10:29:36.127Z	Run `npm audit` for details.
2026-07-07T10:29:36.331Z	Executing user build command: npm run build
2026-07-07T10:29:36.533Z	
2026-07-07T10:29:36.533Z	> my-app@0.0.0 build
2026-07-07T10:29:36.534Z	> tsc -b && vite build
2026-07-07T10:29:36.534Z	
2026-07-07T10:29:45.368Z	failed to load config from /opt/buildhome/repo/vite.config.ts
2026-07-07T10:29:45.369Z	error during build:
2026-07-07T10:29:45.369Z	Error: Cannot find module '../lightningcss.linux-x64-gnu.node'
2026-07-07T10:29:45.369Z	Require stack:
2026-07-07T10:29:45.369Z	- /opt/buildhome/repo/node_modules/lightningcss/node/index.js
2026-07-07T10:29:45.369Z	    at Function._resolveFilename (node:internal/modules/cjs/loader:1401:15)
2026-07-07T10:29:45.369Z	    at defaultResolveImpl (node:internal/modules/cjs/loader:1057:19)
2026-07-07T10:29:45.369Z	    at resolveForCJSWithHooks (node:internal/modules/cjs/loader:1062:22)
2026-07-07T10:29:45.369Z	    at Function._load (node:internal/modules/cjs/loader:1211:37)
2026-07-07T10:29:45.369Z	    at TracingChannel.traceSync (node:diagnostics_channel:322:14)
2026-07-07T10:29:45.369Z	    at wrapModuleLoad (node:internal/modules/cjs/loader:235:24)
2026-07-07T10:29:45.369Z	    at Module.require (node:internal/modules/cjs/loader:1487:12)
2026-07-07T10:29:45.369Z	    at require (node:internal/modules/helpers:135:16)
2026-07-07T10:29:45.369Z	    at Object.<anonymous> (/opt/buildhome/repo/node_modules/lightningcss/node/index.js:20:12)
2026-07-07T10:29:45.369Z	    at Module._compile (node:internal/modules/cjs/loader:1730:14)
2026-07-07T10:29:45.394Z	Failed: error occurred while running build command