import React from 'react';
import './settings.css';

import { NavigateFunction } from 'react-router-dom';
import { Types } from 'syncstream-sharedlib';
import { Time } from 'syncstream-sharedlib/utilities';
import SessionState from '../../utilities/session-state';
import * as api from '../../api';
import Localize from '../../utilities/localize';
import PrimaryButton from '../../components/buttons/primary-button';
import PrimaryInput from '../../components/inputs/primary-input';

interface Props {
  navigate: NavigateFunction;
}

interface State {}

export default class GeneralSettings extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {};
  }

  render() {
    // Grab localize engine
    const localize = Localize.getInstance().localize();

    // Handle User Update
    const updateUser = (event: React.SyntheticEvent) => {
      event.preventDefault();
      const target = event.target as typeof event.target & {
        displayName: { value: string };
        email: { value: string };
        password: { value: string };
      };

      // Build update object
      const updateObj: Types.UserUpdateData = {};
      if (target.displayName.value !== '')
        updateObj.displayName = target.displayName.value;
      if (target.email.value !== '') updateObj.email = target.email.value;
      if (target.password.value !== '')
        updateObj.password = target.password.value;

      api.User.updateUser(updateObj).then(async (res) => {
        if (res === api.SuccessState.ERROR || res === api.SuccessState.FAIL) {
          window.electron.ipcRenderer.invokeFunction('show-message-box', {
            title: localize.settingsPage.general.messageBox.errorTitle,
            message: localize.settingsPage.general.messageBox.updateError,
          });
        } else {
          await Time.delay(100);
          api.User.getCurrentUser().then((userData) => {
            if (
              userData.success === api.SuccessState.FAIL ||
              userData.success === api.SuccessState.ERROR
            ) {
              throw new Error(
                'Unable to get the current user data, something has gone wrong server side.',
              );
            }

            if (userData.data === undefined) throw new Error('Unreachable');
            SessionState.getInstance().currentUser = userData.data;
            this.forceUpdate();
          });
        }
      });
    };

    // ---- RENDER BLOCK ----
    return (
      <>
        <h2 className="text-xl text-gray-800 dark:text-gray-100">
          {localize.settingsPage.general.profile.title}
        </h2>
        <div>
          <div className="flex flex-row">
            <p className="text-gray-600 dark:text-gray-300">
              {localize.settingsPage.general.profile.username}
            </p>
            <p className="text-gray-600 dark:text-gray-300 grow text-right">
              {SessionState.getInstance().currentUser.username}
            </p>
          </div>
          <div className="flex flex-row">
            <p className="text-gray-600 dark:text-gray-300">
              {localize.settingsPage.general.profile.displayName}
            </p>
            <p className="text-gray-600 dark:text-gray-300 grow text-right">
              {SessionState.getInstance().currentUser.displayName}
            </p>
          </div>
          <div className="flex flex-row">
            <p className="text-gray-600 dark:text-gray-300">
              {localize.settingsPage.general.profile.email}
            </p>
            <p className="text-gray-600 dark:text-gray-300 grow text-right">
              {SessionState.getInstance().currentUser.email}
            </p>
          </div>
        </div>

        <hr className="my-5 text-gray-600 dark:text-gray-400 border-1" />

        <h2 className="text-xl mt-3 text-gray-800 dark:text-gray-100">
          {localize.settingsPage.general.changeProfile.title}
        </h2>
        <form onSubmit={updateUser}>
          <PrimaryInput
            labelClassName="mt-1"
            label={localize.settingsPage.general.changeProfile.displayName}
            id="displayName"
            type="text"
          />
          <PrimaryInput
            labelClassName="mt-3"
            label={localize.settingsPage.general.changeProfile.email}
            id="email"
            type="email"
          />
          <PrimaryInput
            labelClassName="mt-3"
            label={localize.settingsPage.general.changeProfile.password}
            id="password"
            type="password"
          />
          <PrimaryButton
            className="mt-3"
            text={localize.settingsPage.general.changeProfile.submit}
            type="submit"
          />
        </form>
      </>
    );
  }
}
