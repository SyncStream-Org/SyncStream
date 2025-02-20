import React, { useEffect, useState } from 'react';
import './launch.css';

import sessionState from '../../utilities/sessionState';
import { SessionState } from '../../types/ipctypes';

// Server URL Render only when needed
function ServerURLInput(params: {
  force: boolean;
  onClickHandler: () => void;
}) {
  console.log(sessionState.getServerURL(), params.force);
  if (sessionState.getServerURL() === '' || params.force) {
    return (
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
          placeholder="http://localhost"
          required
        />
      </>
    );
  }

  return (
    <button
      type="button"
      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      onClick={params.onClickHandler}
    >
      Change Server URL
    </button>
  );
}

export default function Launch() {
  // Is loading state
  const [isLoading, setIsLoading] = useState(true);

  // Load session state from memory on window load (only once)
  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('get-session-state');
  }, []);

  // Load session state when here
  window.electron.ipcRenderer.on('get-session-state', async (newState) => {
    const data = newState as SessionState;
    sessionState.fullUpdate(data);
    setIsLoading(false);
  });

  // Saves value of force server
  const [forceServerUrl, setForceServerUrl] = useState(false);

  // Try to authenticate with server
  const login = (event: React.SyntheticEvent) => {
    event.preventDefault();
    const target = event.target as typeof event.target & {
      server_url: { value: string };
      username: { value: string };
      password: { value: string };
    };

    // sessionState.get()?.serverURL = target.server_url.value;
    alert(`${target.server_url.value}`); // typechecks!
  };

  if (isLoading) return <span>loading...</span>;
  return (
    <div>
      <h1 className="bg-gray-500 text-center text-white">Login</h1>

      <form onSubmit={login} className="m-10">
        <div className="mb-6">
          <ServerURLInput
            force={forceServerUrl}
            onClickHandler={() => {
              setForceServerUrl(!forceServerUrl);
            }}
          />
        </div>
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

        <div className="flex items-start mb-6">
          <div className="flex items-center h-5">
            <input
              id="remember"
              type="checkbox"
              value=""
              className="w-4 h-4 border border-gray-300 rounded-sm bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
              required
            />
          </div>
          <label
            htmlFor="remember"
            className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            I agree with the{' '}
            <a
              href="/"
              className="text-blue-600 hover:underline dark:text-blue-500"
            >
              terms and conditions
            </a>
            .
          </label>
        </div>
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
