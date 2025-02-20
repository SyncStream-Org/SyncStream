import React from 'react';
import './home.css';

import SessionState from '../../utilities/session-state';

export default class Home extends React.Component<
  {},
  {
    sessionSaved: boolean;
  }
> {
  handleUnload: (event: BeforeUnloadEvent) => void;

  constructor(props: {}) {
    super(props);

    this.state = {
      sessionSaved: false,
    };

    this.handleUnload = (event: BeforeUnloadEvent) => {
      // If session is not saved, save and call app quit again
      if (!this.state.sessionSaved) {
        event.preventDefault();

        // Handle saving and then quite
        SessionState.getInstance()
          .saveCache()
          .then(() => {
            this.setState({ sessionSaved: true });
            window.electron.ipcRenderer.sendMessage('app-quit');
          });
      }
    };
  }

  componentDidMount() {
    window.addEventListener('beforeunload', this.handleUnload);
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.handleUnload);
  }

  render() {
    // ---- RENDER BLOCK ----
    return <></>;
  }
}
