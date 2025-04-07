// Used for adding all features needed for a page in the app
// Handles adding navigation, dark mode toggling, and loading / saving of session cache

import React from 'react';
import { NavigateFunction } from 'react-router-dom';
import SessionState from './session-state';
import { withRouter } from './with-router';

export const asPage = (Component: any, manualLoading: boolean) => {
  class Wrapper extends React.Component<
    {
      navigate: NavigateFunction;
    },
    {
      isLoading: boolean;
      isLoadingCache: boolean;
      isLoadingManual: boolean;
      sessionSaved: boolean;
      darkMode: boolean;
    }
  > {
    handleUnload: (event: BeforeUnloadEvent) => void;

    toggleDarkMode: () => void;

    doneLoading: () => void;

    constructor(props: { navigate: NavigateFunction }) {
      super(props);

      this.state = {
        isLoading: true,
        isLoadingCache: true,
        isLoadingManual: true,
        sessionSaved: false,
        darkMode: false,
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

      this.toggleDarkMode = () => {
        this.setState((prevState) => ({ darkMode: !prevState.darkMode }));

        const session = SessionState.getInstance();
        session.updateDarkMode(!session.getDarkMode());

        if (!this.state.darkMode) {
          document.body.setAttribute('data-theme', 'dark');
        } else {
          document.body.removeAttribute('data-theme');
        }
      };

      this.doneLoading = () => {
        if (manualLoading && !this.state.isLoadingCache)
          this.setState({ isLoading: false, isLoadingManual: false });
        else if (manualLoading && this.state.isLoadingCache)
          this.setState({ isLoadingManual: false });
      };
    }

    componentDidMount() {
      // Load session state from memory on window load (only once)
      SessionState.getInstance()
        .loadCache()
        .then((ret: any) => {
          this.setState((prev) => ({
            isLoadingCache: false,
            isLoading: manualLoading && prev.isLoadingManual,
            darkMode: SessionState.getInstance().getDarkMode(),
          }));

          if (SessionState.getInstance().getDarkMode()) {
            document.body.setAttribute('data-theme', 'dark');
          }
        });

      window.addEventListener('beforeunload', this.handleUnload);
    }

    componentWillUnmount() {
      window.removeEventListener('beforeunload', this.handleUnload);
    }

    render() {
      return this.state.isLoading ? (
        <span>loading...</span>
      ) : (
        // Handles dark theme as well
        <div
          data-theme={this.state.darkMode ? 'dark' : ''}
          className="bg-white dark:bg-gray-900 text-black dark:text-white w-screen h-screen overflow-hidden"
        >
          <Component
            toggleDarkMode={this.toggleDarkMode}
            doneLoading={this.doneLoading}
            {...this.props}
          />
        </div>
      );
    }
  }

  return withRouter(Wrapper);
};
