import React from 'react';
import './settings.css';

import { NavigateFunction } from 'react-router-dom';
import { ArrowLeft, LogOut } from 'lucide-react';
import SessionState from '@/utilities/session-state';
import { Button } from '../../components/ui/button';
import Localize from '../../utilities/localize';
import { asPage } from '../../utilities/page-wrapper';
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
      categories: ['general', 'appearance', 'language', 'userManagement'],
    };
  }

  render() {
    // Grab localize engine
    const localize = Localize.getInstance().localize();

    // ---- RENDER BLOCK ----
    return (
      <div className="flex flex-col h-screen">
        <div className="flex-1 p-10 overflow-y-auto max-h-screen no-scrollbar">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">
              {localize.settingsPage.categories.general.title}
            </h1>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  this.props.navigate(-1);
                }}
                className="flex items-center gap-1"
              >
                <ArrowLeft size={16} />
                {localize.settingsPage.backButtonText || 'Back'}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  SessionState.getInstance().sessionToken = '';
                  this.props.navigate('/');
                }}
                className="flex items-center gap-1"
              >
                <LogOut size={16} />
                {localize.settingsPage.general.dangerZone.logOut || 'Logout'}
              </Button>
            </div>
          </div>
          <div className="mt-6">
            <GeneralSettings />
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
