// Entry of the externals build. The plugin's code (./mount) reads React,
// ReactDOM and the SDK from SHARED_DEPENDENCIES_GLOBAL, so it only runs after
// they are resolved. It is imported in eager mode: it stays in this file, and
// the best case (client provides compatible copies) is a single request.
import loadSharedDependencies from './shared-dependencies';

// Replaced at build time (webpack.external.js).
declare const SHARED_DEPENDENCIES_GLOBAL: string;

// document.currentScript is only set while this script runs synchronously.
const script = document.currentScript as HTMLScriptElement | null;
const uuid = script?.getAttribute('uuid') || 'root';
const pluginName = script?.getAttribute('pluginName') || 'plugin';

loadSharedDependencies(script?.src || window.location.href)
  .then((dependencies) => {
    (window as unknown as Record<string, unknown>)[SHARED_DEPENDENCIES_GLOBAL] = dependencies;
    return import(/* webpackMode: "eager" */ '../mount');
  })
  .then(({ default: mount }) => mount({ uuid, pluginName }))
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error(`[${pluginName}] could not load React, ReactDOM and the plugin SDK:`, error);
  });
