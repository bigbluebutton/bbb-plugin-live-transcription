// Decides where the shared libraries (React, ReactDOM, the plugin SDK and the
// UI libraries listed in webpack.external.js) come from, as one group: either
// all from the BigBlueButton client (globals it exposes) or all from this
// plugin's own vendor file. They depend on each other (the UI libraries use
// the React they import), so a partial set from the client is never used.

// Replaced at build time (webpack.external.js).
// Globals the client must expose.
declare const SHARED_GLOBALS: string[];
// Expected major version, for the libraries that export their version.
declare const SHARED_MAJORS: Record<string, string>;
declare const VENDOR_FILE: string;
declare const VENDOR_GLOBAL: string;

export type SharedDependencies = Record<string, unknown>;

type Globals = Record<string, { version?: string } | undefined>;

const fromClient = (): SharedDependencies | undefined => {
  const globals = window as unknown as Globals;
  const complete = SHARED_GLOBALS.every((name) => globals[name]);
  const sameMajors = Object.keys(SHARED_MAJORS).every(
    (name) => globals[name]?.version?.split('.')[0] === SHARED_MAJORS[name],
  );
  if (!complete || !sameMajors) return undefined;
  return SHARED_GLOBALS.reduce((dependencies, name) => (
    { ...dependencies, [name]: globals[name] }
  ), {} as SharedDependencies);
};

const fromVendorFile = (pluginScriptUrl: string): Promise<SharedDependencies> => (
  new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = new URL(VENDOR_FILE, pluginScriptUrl).href;
    script.onload = () => {
      const vendor = (window as unknown as Record<string, SharedDependencies>)[VENDOR_GLOBAL];
      if (vendor) resolve(vendor);
      else reject(new Error(`${VENDOR_FILE} did not define ${VENDOR_GLOBAL}`));
    };
    script.onerror = () => reject(new Error(`Could not load ${script.src}`));
    document.head.appendChild(script);
  })
);

const loadSharedDependencies = (pluginScriptUrl: string): Promise<SharedDependencies> => {
  const client = fromClient();
  return client ? Promise.resolve(client) : fromVendorFile(pluginScriptUrl);
};

export default loadSharedDependencies;
