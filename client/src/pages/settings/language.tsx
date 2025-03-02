import React from 'react';
import './settings.css';

import SessionState from '../../utilities/session-state';
import Localize, { Language, LanguageArray } from '../../utilities/localize';
import PrimarySelect from '../../components/selects/primary-select';

interface Props {}

interface State {}

export default class LanguageSettings extends React.Component<Props, State> {
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
        <PrimarySelect
          label={localize.settingsPage.general.languageChange}
          categories={LanguageArray}
          defaultCategory={Localize.getInstance().currentLanguage}
          onChange={(category) => {
            Localize.getInstance().currentLanguage = category as Language;
            this.forceUpdate();
          }}
        />
      </>
    );
  }
}
