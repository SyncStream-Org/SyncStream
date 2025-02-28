import React from 'react';
import './launch.css';

import { NavigateFunction } from 'react-router-dom';
import SessionState from '../../utilities/session-state';
import * as api from '../../api';
import { asPage } from '../../utilities/page-wrapper';
import PrimaryButton from '../../components/buttons/primary-button';
import PrimaryInput from '../../components/inputs/primary-input';
import Localize from '../../utilities/localize';

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
    // Grab localize engine
    const localize = Localize.getInstance().localize();

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
              api.User.getCurrentUser().then((userData) => {
                if (
                  userData.success === api.SuccessState.FAIL ||
                  userData.success === api.SuccessState.ERROR
                ) {
                  throw new Error(
                    'Unable to get the current user data, something has gone wrong server side.',
                  );
                }

                if (userData.data === undefined) throw new Error('Unreachable');
                SessionState.getInstance().currentUser = userData.data;
              });

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
          {localize.launchPage.title}
        </h1>
        <form onSubmit={login} className="m-10">
          <div className="mb-6">
            <PrimaryInput
              label={localize.launchPage.usernameLabel}
              id="username"
              type="text"
              required
            />
          </div>

          <div className="mb-6">
            <PrimaryInput
              label={localize.launchPage.passwordLabel}
              id="password"
              type="password"
              required
            />
          </div>

          <div className="mb-6">
            {SessionState.getInstance().serverURL === '' ||
            this.state.forceServerURL ? (
              <PrimaryInput
                label={localize.launchPage.serverURLLabel}
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
                text={localize.launchPage.serverURLButtonText}
                onClick={() => {
                  this.setState((prevState) => ({
                    forceServerURL: !prevState.forceServerURL,
                  }));
                }}
              />
            )}
          </div>

          <PrimaryButton
            text={localize.launchPage.submitButtonText}
            type="submit"
          />
        </form>
        <button
          type="button"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          onClick={() => {
            this.props.navigate('/room');
          }}
        >
          DEV BYPASS (ROOM)
        </button>
      </>
    );
  }
}

// Add wrapper for navigation function
export default asPage(Launch);
