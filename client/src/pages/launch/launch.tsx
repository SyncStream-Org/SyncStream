import React from 'react';
import './launch.css';

import { NavigateFunction } from 'react-router-dom';
import { withRouter } from '../../utilities/with-router';
import SessionState from '../../utilities/session-state';
import echo from '../../api/routes/misc';
import { authenticate } from '../../api/routes/user';

class Launch extends React.Component<
  {
    navigate: NavigateFunction;
  },
  {
    isLoading: boolean;
    sessionSaved: boolean;
    forceServerURL: boolean;
  }
> {
  handleUnload: (event: BeforeUnloadEvent) => void;

  constructor(props: { navigate: NavigateFunction }) {
    super(props);

    this.state = {
      isLoading: true,
      sessionSaved: false,
      forceServerURL: false,
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
    // Load session state from memory on window load (only once)
    SessionState.getInstance()
      .loadCache()
      .then((ret: any) => {
        this.setState({ isLoading: false });
      });

    window.addEventListener('beforeunload', this.handleUnload);
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.handleUnload);
  }

  render() {
    // Try to authenticate with server
    const login = (event: React.SyntheticEvent) => {
      event.preventDefault();
      const target = event.target as typeof event.target & {
        server_url: { value: string };
        username: { value: string };
        password: { value: string };
      };

      // Change server url if needed
      const serverURLCache = SessionState.getInstance().serverURL;
      if (
        SessionState.getInstance().serverURL === '' ||
        this.state.forceServerURL
      ) {
        SessionState.getInstance().serverURL = target.server_url.value;
      }

      echo().then((res) => {
        if (res === null) {
          window.electron.ipcRenderer.invokeFunction('show-message-box', {
            title: 'Error',
            message:
              'Invalid server address. Please enter correct address or contact your administrator for help.',
          });

          SessionState.getInstance().serverURL = serverURLCache;
        } else {
          authenticate(target.username.value, target.password.value).then(
            (authRes) => {
              if (authRes === null) return;
              if (authRes === false) {
                window.electron.ipcRenderer.invokeFunction('show-message-box', {
                  title: 'Error',
                  message: 'Invalid username or password.',
                });
              } else {
                this.props.navigate('/home');
              }
            },
          );
        }
      });
    };

    // ---- RENDER BLOCK ----
    return this.state.isLoading ? (
      <span>loading...</span>
    ) : (
      <>
        <h1 className="mt-6 mb-6 text-2xl text-center text-white">Login</h1>
        <form onSubmit={login} className="m-10">
          <div className="mb-6">
            <label
              htmlFor="username"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Username"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Password"
              required
            />
          </div>
          <div className="mb-6">
            {SessionState.getInstance().serverURL === '' ||
            this.state.forceServerURL ? (
              <>
                <label
                  htmlFor="Server URL"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Server URL
                </label>
                <input
                  type="url"
                  id="server_url"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder={
                    SessionState.getInstance().serverURL === ''
                      ? 'https://domain.com'
                      : SessionState.getInstance().serverURL
                  }
                  required
                />
              </>
            ) : (
              <button
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                onClick={() => {
                  this.setState((prevState) => ({
                    forceServerURL: !prevState.forceServerURL,
                  }));
                }}
              >
                Change Server URL
              </button>
            )}
          </div>

          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Submit
          </button>
        </form>
        <button
          type="button"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          onClick={() => {
            this.props.navigate('/home');
          }}
        >
          DEV BYPASS
        </button>
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
export default withRouter(Launch);
