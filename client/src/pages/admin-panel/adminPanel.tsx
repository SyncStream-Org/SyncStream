import { useState, useEffect, SyntheticEvent, useCallback, ChangeEvent } from 'react';
import { NavigateFunction } from 'react-router-dom';
import { ArrowLeft, LogOut } from 'lucide-react';
import { Types } from 'syncstream-sharedlib';
import { Time } from 'syncstream-sharedlib/utilities';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import SessionState from '@/utilities/session-state';
import { asPage } from '@/utilities/page-wrapper';
import { Button } from '@/components/ui/button';
import * as api from '../../api';
import Localize from '@/utilities/localize';
import { AdminManagementSection } from '@/components/user-management/adminManagement';
import { Card, CardContent } from '@/components/ui/card';

interface Props {
  // eslint-disable-next-line react/no-unused-prop-types
  toggleDarkMode: () => void;
  // eslint-disable-next-line react/no-unused-prop-types
  doneLoading: () => void;
  navigate: NavigateFunction;
}

function Home(props: Props) {
  const [users, setUsers] = useState<Types.UserData[]>([]);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    isAdmin: false,
    displayName: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };
  const localize = Localize.getInstance().localize();

  const fetchUsers = useCallback(() => {
    api.Admin.getAllUsers().then((res) => {
      if (
        res.success === api.SuccessState.ERROR ||
        res.success === api.SuccessState.FAIL
      ) {
        window.electron.ipcRenderer.invokeFunction('show-message-box', {
          title: 'Error',
          message: 'Unable to get room data at this time.',
        });
      } else {
        if (res.data === undefined) throw Error('Unreachable');
        setUsers(res.data);
      }
    });
  }, []);

  const createUser = (event: SyntheticEvent) => {
    event.preventDefault();

    api.Admin.createUser(
      formData.username,
      formData.email,
      formData.isAdmin,
      formData.displayName,
    ).then(async (res) => {
      if (res === api.SuccessState.ERROR || res === api.SuccessState.FAIL) {
        window.electron.ipcRenderer.invokeFunction('show-message-box', {
          title: localize.settingsPage.userManagement.messageBox.errorTitle,
          message:
            localize.settingsPage.userManagement.messageBox.userCreateError,
        });
      } else {
        await Time.delay(100);
        fetchUsers();
      }
    });
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 p-10 overflow-y-auto max-h-screen no-scrollbar">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                props.navigate(-1);
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
                props.navigate('/');
              }}
              className="flex items-center gap-1"
            >
              <LogOut size={16} />
              {localize.settingsPage.general.dangerZone.logOut || 'Logout'}
            </Button>
          </div>
        </div>
        <hr className="my-5 text-gray-600 dark:text-gray-400 border-1" />
        <h1 className="text-2xl font-bold">User Management</h1>
        <div className="mt-6">
          <AdminManagementSection users={users} />
        </div>
        <hr className="my-5 text-gray-600 dark:text-gray-400 border-1" />
        <h1 className="text-2xl font-bold">User Creation</h1>
        <div className="mt-6">
          <Card>
            <CardContent className="pt-2">
              <form onSubmit={createUser} className="space-y-2">
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
        </div>
      </div>
    </div>
  );
}
export default asPage(Home, false);
