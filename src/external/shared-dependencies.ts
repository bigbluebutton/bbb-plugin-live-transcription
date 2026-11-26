// Decides where React, ReactDOM and the plugin SDK come from, as one group:
// either all from the BigBlueButton client (globals it exposes) or all from
// this plugin's own vendor file. Mixing them (for example the client's React
// with this plugin's ReactDOM or SDK) breaks hooks, so a partial set from the
// client is never used.

// Replaced at build time (webpack.external.js).
declare const SHARED_REACT_MAJOR: string;
declare const VENDOR_FILE: string;
declare const VENDOR_GLOBAL: string;

export interface SharedDependencies {
  React: unknown;
  ReactDOM: unknown;
  ReactDOMClient: unknown;
  BbbPluginSdk: unknown;
}

type Globals = Partial<SharedDependencies> & { React?: { version?: string } };

const fromClient = (): SharedDependencies | undefined => {
  const {
    React, ReactDOM, ReactDOMClient, BbbPluginSdk,
  } = window as unknown as Globals;
  const reactMajor = React?.version?.split('.')[0];
  const complete = React && ReactDOM && ReactDOMClient && BbbPluginSdk;
  if (!complete || reactMajor !== SHARED_REACT_MAJOR) return undefined;
  return {
    React, ReactDOM, ReactDOMClient, BbbPluginSdk,
  };
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
