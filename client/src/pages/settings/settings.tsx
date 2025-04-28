import React from 'react';
import './settings.css';

import { NavigateFunction } from 'react-router-dom';
import PrimaryButton from '../../components/buttons/primary-button';
import Localize, { SettingsPageCategories } from '../../utilities/localize';
import { asPage } from '../../utilities/page-wrapper';
import SessionState from '../../utilities/session-state';
import AppearanceSettings from './appearance';
import GeneralSettings from './general';
import LanguageSettings from './language';
import UserManagementSettings from './userManagment';

interface Props {
  // eslint-disable-next-line react/no-unused-prop-types
  toggleDarkMode: () => void;
  // eslint-disable-next-line react/no-unused-prop-types
  doneLoading: () => void;
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
        <div className="flex-1 p-10 overflow-y-auto max-h-screen no-scrollbar">
          <h1 className="text-2xl font-bold">
            {localize.settingsPage.categories.general.title}
          </h1>
          <div className="mt-6">
            <GeneralSettings navigate={this.props.navigate} />
            {this.state.activeCategory === 'userManagement' && (
              <UserManagementSettings />
            )}
          </div>
          <hr className="my-5 text-gray-600 dark:text-gray-400 border-1" />
          <h1 className="text-2xl font-bold">
            {localize.settingsPage.categories.appearance.title}
          </h1>
          <div className="mt-6">
            <AppearanceSettings toggleDarkMode={this.props.toggleDarkMode} />
          </div>
          <hr className="my-5 text-gray-600 dark:text-gray-400 border-1" />
          <h1 className="text-2xl font-bold">
            {localize.settingsPage.categories.language.title}
          </h1>
          <div className="mt-6">
            <LanguageSettings
              forceUpdate={() => {
                this.forceUpdate();
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

// Add wrapper for navigation function
export default asPage(Settings, false);
