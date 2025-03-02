import React from 'react';
import './settings.css';

import { NavigateFunction } from 'react-router-dom';
import SessionState from '../../utilities/session-state';
import { asPage } from '../../utilities/page-wrapper';
import * as api from '../../api';
import Localize, {
  Language,
  LanguageArray,
  SettingsPageCategories,
} from '../../utilities/localize';
import PrimaryButton from '../../components/buttons/primary-button';
import PrimarySelect from '../../components/selects/primary-select';
import PrimaryInput from '../../components/inputs/primary-input';
import { Types } from 'syncstream-sharedlib';
import { Time } from 'syncstream-sharedlib/utilities';
import UserManagementSettings from './userManagment';
import LanguageSettings from './language';
import AppearanceSettings from './appearance';
import GeneralSettings from './general';

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
      activeCategory: 'general',
      categories: SessionState.getInstance().currentUser.admin
        ? ['general', 'appearance', 'language', 'userManagement']
        : ['general', 'appearance', 'language'],
    };
  }

  render() {
    // Grab localize engine
    const localize = Localize.getInstance().localize();

    // ---- RENDER BLOCK ----
    return (
      <div className="flex h-screen">
        <div className="flex flex-col w-64 dark:bg-gray-800 shadow-lg">
          <div className="p-6">
            <h2 className="text-lg font-semibold">
              {localize.settingsPage.title}
            </h2>
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
                {
                  localize.settingsPage.categories[
                    category as SettingsPageCategories
                  ].shortTitle
                }
              </div>
            ))}
          </nav>
          <PrimaryButton
            text={localize.settingsPage.backButtonText}
            className="mx-4 mb-4"
            onClick={() => {
              this.props.navigate('/home');
            }}
          />
        </div>
        <div className="flex-1 p-10 overflow-y-auto max-h-screen no-scrollbar">
          <h1 className="text-2xl font-bold">
            {
              localize.settingsPage.categories[
                this.state.activeCategory as SettingsPageCategories
              ].title
            }
          </h1>
          <div className="mt-6">
            {this.state.activeCategory === 'general' && (
              <GeneralSettings navigate={this.props.navigate} />
            )}
            {this.state.activeCategory === 'appearance' && (
              <AppearanceSettings toggleDarkMode={this.props.toggleDarkMode} />
            )}
            {this.state.activeCategory === 'language' && <LanguageSettings />}
            {this.state.activeCategory === 'userManagement' && (
              <UserManagementSettings />
            )}
          </div>
        </div>
      </div>
    );
  }
}

// Add wrapper for navigation function
export default asPage(Settings);
