import React from 'react';
import './settings.css';

import { NavigateFunction } from 'react-router-dom';
import SessionState from '../../utilities/session-state';
import { asPage } from '../../utilities/page-wrapper';
import { Language, LanguageArray } from '../../utilities/localize';
import PrimaryButton from '../../components/buttons/primary-button';
import PrimarySelect from '../../components/selects/primary-select';

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

// TODO: localize
class Settings extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      activeCategory: 'General',
      categories: SessionState.getInstance().currentUser.admin
        ? ['General', 'Appearance', 'Language', 'User Management']
        : ['General', 'Appearance', 'Language'],
    };
  }

  render() {
    // ---- RENDER BLOCK ----
    return (
      <div className="flex h-screen">
        <div className="flex flex-col w-64 dark:bg-gray-800 shadow-lg">
          <div className="p-6">
            <h2 className="text-lg font-semibold">Settings</h2>
          </div>
          <nav className="grow">
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
          <PrimaryButton
            text="Go Back"
            className="mx-4 mb-4"
            onClick={() => {
              this.props.navigate('/home');
            }}
          />
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
            {this.state.activeCategory === 'Appearance' && (
              <div>
                <p className="text-gray-600 dark:text-gray-300">Color Scheme</p>
                <PrimaryButton
                  text={
                    SessionState.getInstance().getDarkMode()
                      ? 'Turn on Light Mode'
                      : 'Turn on Dark Mode'
                  }
                  onClick={this.props.toggleDarkMode}
                />
              </div>
            )}
            {this.state.activeCategory === 'Language' && (
              <div>
                <PrimarySelect
                  label="App Language"
                  categories={LanguageArray}
                />
              </div>
            )}
            {this.state.activeCategory === 'User Management' && (
              <div>
                <p className="text-gray-600 dark:text-gray-300">
                  User Management settings content goes here...
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
