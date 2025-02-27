import React from 'react';
import './settings.css';

import { NavigateFunction } from 'react-router-dom';
import SessionState from '../../utilities/session-state';
import { asPage } from '../../utilities/page-wrapper';

interface Props {
  // eslint-disable-next-line react/no-unused-prop-types
  toggleDarkMode: () => void;
  // eslint-disable-next-line react/no-unused-prop-types
  navigate: NavigateFunction;
}

interface State {
  activeCategory: string;
  categories: string[];
}

class Settings extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      activeCategory: 'General',
      categories: [
        'General',
        'Privacy',
        'Security',
        'Notifications',
        'Appearance',
        'Language',
        'Advanced',
      ],
    };
  }

  render() {
    // ---- RENDER BLOCK ----
    return (
      <div className="flex h-screen">
        <div className="w-64 dark:bg-gray-800 shadow-lg">
          <div className="p-6">
            <h2 className="text-lg font-semibold">Settings</h2>
          </div>
          <nav>
            {this.state.categories.map((category) => (
              <div
                key={category}
                className={`p-4 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer ${this.state.activeCategory === category ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
                onClick={() => {
                  this.setState({ activeCategory: category });
                }}
              >
                {category}
              </div>
            ))}
          </nav>
        </div>
        <div className="flex-1 p-10">
          <h1 className="text-2xl font-bold">
            {this.state.activeCategory} Settings
          </h1>
          <div className="mt-6">
            {this.state.activeCategory === 'General' && (
              <div>
                <p className="text-gray-600 dark:text-gray-300">
                  General settings content goes here...
                </p>
              </div>
            )}
            {this.state.activeCategory === 'Privacy' && (
              <div>
                <p className="text-gray-600 dark:text-gray-300">
                  Privacy settings content goes here...
                </p>
              </div>
            )}
            {this.state.activeCategory === 'Security' && (
              <div>
                <p className="text-gray-600 dark:text-gray-300">
                  Security settings content goes here...
                </p>
              </div>
            )}
            {this.state.activeCategory === 'Notifications' && (
              <div>
                <p className="text-gray-600 dark:text-gray-300">
                  Notifications settings content goes here...
                </p>
              </div>
            )}
            {this.state.activeCategory === 'Appearance' && (
              <div>
                <p className="text-gray-600 dark:text-gray-300">
                  Appearance settings content goes here...
                </p>
              </div>
            )}
            {this.state.activeCategory === 'Language' && (
              <div>
                <p className="text-gray-600 dark:text-gray-300">
                  Language settings content goes here...
                </p>
              </div>
            )}
            {this.state.activeCategory === 'Advanced' && (
              <div>
                <p className="text-gray-600 dark:text-gray-300">
                  Advanced settings content goes here...
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

// Add wrapper for navigation function
export default asPage(Settings);
