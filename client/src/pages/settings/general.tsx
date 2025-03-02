import React from 'react';
import './settings.css';

import { NavigateFunction } from 'react-router-dom';
import SessionState from '../../utilities/session-state';
import * as api from '../../api';
import Localize from '../../utilities/localize';
import PrimaryButton from '../../components/buttons/primary-button';
import PrimaryInput from '../../components/inputs/primary-input';
import { Types } from 'syncstream-sharedlib';
import { Time } from 'syncstream-sharedlib/utilities';

interface Props {
  // eslint-disable-next-line react/no-unused-prop-types
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
        if (res === api.SuccessState.ERROR) {
          window.electron.ipcRenderer.invokeFunction('show-message-box', {
            title: 'Error',
            message:
              'Unable to update user at this time. Try again in a few minutes.',
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
        <h2 className="text-xl text-gray-800 dark:text-gray-100">Profile</h2>
        <div>
          <div className="flex flex-row">
            <p className="text-gray-600 dark:text-gray-300">Username:</p>
            <p className="text-gray-600 dark:text-gray-300 grow text-right">
              {SessionState.getInstance().currentUser.username}
            </p>
          </div>
          <div className="flex flex-row">
            <p className="text-gray-600 dark:text-gray-300">Display Name:</p>
            <p className="text-gray-600 dark:text-gray-300 grow text-right">
              {SessionState.getInstance().currentUser.displayName}
            </p>
          </div>
          <div className="flex flex-row">
            <p className="text-gray-600 dark:text-gray-300">Email:</p>
            <p className="text-gray-600 dark:text-gray-300 grow text-right">
              {SessionState.getInstance().currentUser.email}
            </p>
          </div>
        </div>

        <hr className="my-5 text-gray-600 dark:text-gray-400 border-1" />

        <h2 className="text-xl mt-3 text-gray-800 dark:text-gray-100">
          Change Profile
        </h2>
        <form onSubmit={updateUser}>
          <PrimaryInput
            labelClassName="mt-1"
            label="Display Name"
            id="displayName"
            type="text"
          />
          <PrimaryInput
            labelClassName="mt-3"
            label="Email"
            id="email"
            type="email"
          />
          <PrimaryInput
            labelClassName="mt-3"
            label="Password"
            id="password"
            type="password"
          />
          <PrimaryButton className="mt-3" text="Submit" type="submit" />
        </form>

        <hr className="my-5 text-gray-600 dark:text-gray-400 border-1" />

        <h2 className="text-xl text-gray-800 dark:text-gray-100">
          Danger Zone
        </h2>
        <PrimaryButton
          className="mt-2"
          text="Log Out"
          type="button"
          onClick={() => {
            SessionState.getInstance().sessionToken = '';
            this.props.navigate('/');
          }}
        />
      </>
    );
  }
}
