import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { LiveTranscriptionPlugin } from './components/app/component';

interface MountArgs {
  uuid: string;
  // Passed by the client to every plugin; this plugin does not use it.
  pluginName?: string;
}

const mount = ({ uuid }: MountArgs) => {
  const root = ReactDOM.createRoot(document.getElementById(uuid));
  root.render(
    <LiveTranscriptionPlugin {...{
      pluginUuid: uuid,
    }}
    />,
  );
};

export default mount;
