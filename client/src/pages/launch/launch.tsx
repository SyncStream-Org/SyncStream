import React from 'react';
import './launch.css';

import { NavigateFunction } from 'react-router-dom';
import SessionState from '../../utilities/session-state';
import * as api from '../../api';
import { asPage } from '../../utilities/page-wrapper';
import PrimaryButton from '../../components/buttons/primary-button';
import PrimaryInput from '../../components/inputs/primary-input';

interface Props {
  // eslint-disable-next-line react/no-unused-prop-types
  toggleDarkMode: () => void;
  navigate: NavigateFunction;
}

interface State {
  forceServerURL: boolean;
}

class Launch extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      forceServerURL: false,
    };
  }

  render() {
    // Try to authenticate with server
    const login = (event: React.SyntheticEvent) => {
      event.preventDefault();
      const target = event.target as typeof event.target & {
        serverURL: { value: string };
        username: { value: string };
        password: { value: string };
      };

      // Change server url if needed
      const serverURLCache = SessionState.getInstance().serverURL;
      if (
        SessionState.getInstance().serverURL === '' ||
        this.state.forceServerURL
      ) {
        SessionState.getInstance().serverURL = target.serverURL.value;
      }

      api.echo().then((res) => {
        if (res === api.SuccessState.FAIL || res === api.SuccessState.ERROR) {
          window.electron.ipcRenderer.invokeFunction('show-message-box', {
            title: 'Error',
            message:
              'Invalid server address. Please enter correct address or contact your administrator for help.',
          });

          SessionState.getInstance().serverURL = serverURLCache;
        } else {
          api.User.authenticate(
            target.username.value,
            target.password.value,
          ).then((authRes) => {
            if (authRes === api.SuccessState.ERROR) return;
            if (authRes === api.SuccessState.FAIL) {
              window.electron.ipcRenderer.invokeFunction('show-message-box', {
                title: 'Error',
                message: 'Invalid username or password.',
              });
            } else {
              this.props.navigate('/home');
            }
          });
        }
      });
    };

    // ---- RENDER BLOCK ----
    return (
      <>
        <h1 className="mt-6 mb-6 text-2xl text-center text-gray-900 dark:text-white">
          Login
        </h1>
        <form onSubmit={login} className="m-10">
          <div className="mb-6">
            <PrimaryInput label="Username" id="username" type="text" required />
          </div>

          <div className="mb-6">
            <PrimaryInput
              label="Password"
              id="password"
              type="password"
              required
            />
          </div>

          <div className="mb-6">
            {SessionState.getInstance().serverURL === '' ||
            this.state.forceServerURL ? (
              <PrimaryInput
                label="Server URL"
                id="serverURL"
                type="url"
                placeholder={
                  SessionState.getInstance().serverURL === ''
                    ? 'https://domain.com'
                    : SessionState.getInstance().serverURL
                }
                required
              />
            ) : (
              <PrimaryButton
                text="Change Server URL"
                onClick={() => {
                  this.setState((prevState) => ({
                    forceServerURL: !prevState.forceServerURL,
                  }));
                }}
              />
            )}
          </div>

          <PrimaryButton text="Submit" type="submit" />
        </form>
      </>
    );
  }
}

// Add wrapper for navigation function
export default asPage(Launch);
