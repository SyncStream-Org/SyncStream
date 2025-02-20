import React, { useEffect, useState } from 'react';
import './launch.css';

import { SessionCache } from '../../types/ipctypes';

export default class Launch extends React.Component<
  {},
  {
    isLoading: boolean;
    sessionCache: SessionCache;
    sessionSaved: boolean;
    forceServerURL: boolean;
  }
> {
  handleUnload: (event: BeforeUnloadEvent) => void;

  constructor(props: {}) {
    super(props);

    this.state = {
      isLoading: true,
      sessionCache: {
        serverURL: '',
      } as SessionCache,
      sessionSaved: false,
      forceServerURL: false,
    };

    this.handleUnload = (event: BeforeUnloadEvent) => {
      // If session is not saved, save and call app quit again
      if (!this.state.sessionSaved) {
        event.preventDefault();

        // Handle saving and then quite
        window.electron.ipcRenderer
          .invokeFunction('save-session-cache', this.state.sessionCache)
          .then(() => {
            this.setState({ sessionSaved: true });
            window.electron.ipcRenderer.sendMessage('app-quit');
          });
      }
    };
  }

  componentDidMount() {
    // Load session state from memory on window load (only once)
    window.electron.ipcRenderer
      .invokeFunction('get-session-cache')
      .then((ret: any) => {
        this.setState({
          isLoading: false,
          sessionCache: ret as SessionCache,
        });
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

      // TODO: Checks for server url legitimacy and login
      this.setState({ sessionCache: { serverURL: target.server_url.value } });
      alert(`${target.server_url.value}`); // typechecks!
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
            {this.state.sessionCache.serverURL === '' ||
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
                    this.state.sessionCache.serverURL === ''
                      ? 'https://domain.com'
                      : this.state.sessionCache.serverURL
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
      </>
    );
  }
}
