// The plugin's own React, ReactDOM and SDK, used only when the client does not
// provide compatible copies (see shared-dependencies.ts).
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as ReactDOMClient from 'react-dom/client';
import * as BbbPluginSdk from 'bigbluebutton-html-plugin-sdk';

export {
  React, ReactDOM, ReactDOMClient, BbbPluginSdk,
};
