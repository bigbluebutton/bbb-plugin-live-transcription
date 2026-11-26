// The plugin's own copies of the shared libraries, used only when the client
// does not provide compatible ones (see shared-dependencies.ts). The export
// names are the globals the client exposes (webpack.external.js).
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as ReactDOMClient from 'react-dom/client';
import * as BbbPluginSdk from 'bigbluebutton-html-plugin-sdk';
import * as ReactIntl from 'react-intl';
import * as StyledComponents from 'styled-components';

export {
  React, ReactDOM, ReactDOMClient, BbbPluginSdk, ReactIntl, StyledComponents,
};
