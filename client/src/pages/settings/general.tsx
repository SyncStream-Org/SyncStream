import { Types } from 'syncstream-sharedlib';
import { Time } from 'syncstream-sharedlib/utilities';
import { useReducer, useState, ChangeEvent, SyntheticEvent } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Localize from '../../utilities/localize';
import * as api from '../../api';
import SessionState from '../../utilities/session-state';

function GeneralSettings() {
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };
  // Grab localize engine
  const localize = Localize.getInstance().localize();

  // Handle User Update
  const updateUser = (event: SyntheticEvent) => {
    event.preventDefault();

    // Build update object
    const updateObj: Types.UserUpdateData = {};
    if (formData.displayName !== '')
      updateObj.displayName = formData.displayName;
    if (formData.email !== '') updateObj.email = formData.email;
    if (formData.password !== '') updateObj.password = formData.password;

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
          window.electron.ipcRenderer.invokeFunction('show-message-box', {
            title: localize.settingsPage.general.messageBox.successTitle,
            message: `${
              localize.settingsPage.general.messageBox.updateSuccess
            }:\n ${
              updateObj.displayName
                ? `${localize.settingsPage.general.changeProfile.displayName}\n`
                : ''
            } ${
              updateObj.email
                ? `${localize.settingsPage.general.changeProfile.email}\n`
                : ''
            } ${
              updateObj.password
                ? `${localize.settingsPage.general.changeProfile.password}\n`
                : ''
            }`,
          });
          SessionState.getInstance().currentUser = userData.data;
          setFormData({
            displayName: '',
            email: '',
            password: '',
          });
          forceUpdate();
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
      <Card>
        <CardContent>
          <div className="flex flex-row">
            <p className="text-gray-800 dark:text-gray-300">
              {localize.settingsPage.general.profile.username}
            </p>
            <p className="text-gray-600 dark:text-gray-300 grow text-right">
              {SessionState.getInstance().currentUser.username}
            </p>
          </div>
          <div className="flex flex-row">
            <p className="text-gray-800 dark:text-gray-300">
              {localize.settingsPage.general.profile.displayName}
            </p>
            <p className="text-gray-600 dark:text-gray-300 grow text-right">
              {SessionState.getInstance().currentUser.displayName}
            </p>
          </div>
          <div className="flex flex-row">
            <p className="text-gray-800 dark:text-gray-300">
              {localize.settingsPage.general.profile.email}
            </p>
            <p className="text-gray-600 dark:text-gray-300 grow text-right">
              {SessionState.getInstance().currentUser.email}
            </p>
          </div>
        </CardContent>
      </Card>

      <hr className="my-5 text-gray-600 dark:text-gray-400 border-1" />

      <h2 className="text-xl mt-6 mb-4 text-gray-800 dark:text-gray-100">
        {localize.settingsPage.general.changeProfile.title}
      </h2>

      <Card>
        <CardContent className="pt-2">
          <form onSubmit={updateUser} className="space-y-2">
            <div className="space-y-2">
              <Label htmlFor="displayName">
                {localize.settingsPage.general.changeProfile.displayName}
              </Label>
              <Input
                id="displayName"
                type="text"
                placeholder="New display name"
                value={formData.displayName}
                onChange={handleChange}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                {localize.settingsPage.general.changeProfile.email}
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="New email address"
                value={formData.email}
                onChange={handleChange}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                {localize.settingsPage.general.changeProfile.password}
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="New password"
                className="w-full"
              />
            </div>

            <Button type="submit" className="mt-4 bg-blue-700">
              {localize.settingsPage.general.changeProfile.submit}
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
}

export default GeneralSettings;
