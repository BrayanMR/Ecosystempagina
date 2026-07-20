// Vercel serverless function entry point.
//
// Vercel treats every file in /api as a serverless function. The Angular build
// (server.ts) produces `dist/ecosystem/server/server.mjs`, which exports the
// `app()` factory (it returns a fresh Express instance). Here we invoke it once
// to build the Express app and re-export the instance as the default handler,
// so Vercel routes every request through Angular's CommonEngine for SSR.
//
// The static import lets Vercel's file tracing (@vercel/node + nft) follow the
// dependency graph and bundle the server output into the function. The build
// step (`npm run build`) runs before function bundling, so the file exists.
//
// Source: https://dev.to/playfulprogramming-angular/essential-angular-ssr-config-to-deploy-on-vercel-2lka
import createApp from '../dist/ecosystem/server/server.mjs';

const app = typeof createApp === 'function' ? createApp() : createApp;

export default app;
