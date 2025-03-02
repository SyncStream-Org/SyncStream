import React from 'react';
import './settings.css';

import SessionState from '../../utilities/session-state';
import Localize from '../../utilities/localize';
import PrimaryButton from '../../components/buttons/primary-button';

interface Props {
  // eslint-disable-next-line react/no-unused-prop-types
  toggleDarkMode: () => void;
}

interface State {}

export default class AppearanceSettings extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {};
  }

  render() {
    // Grab localize engine
    const localize = Localize.getInstance().localize();

    // ---- RENDER BLOCK ----
    return (
      <>
        <p className="text-gray-600 dark:text-gray-300">
          {localize.settingsPage.appearance.colorScheme.label}
        </p>
        <PrimaryButton
          text={
            SessionState.getInstance().getDarkMode()
              ? localize.settingsPage.appearance.colorScheme.darkMode
              : localize.settingsPage.appearance.colorScheme.lightMode
          }
          onClick={this.props.toggleDarkMode}
        />
      </>
    );
  }
}
