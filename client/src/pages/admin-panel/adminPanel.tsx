import {
  useState,
  useEffect,
  SyntheticEvent,
  useCallback,
  ChangeEvent,
} from 'react';
import { NavigateFunction } from 'react-router-dom';
import { ArrowLeft, LogOut } from 'lucide-react';
import { Types } from 'syncstream-sharedlib';
import { Time } from 'syncstream-sharedlib/utilities';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import SessionState from '@/utilities/session-state';
import { asPage } from '@/utilities/page-wrapper';
import { Button } from '@/components/ui/button';
import Localize from '@/utilities/localize';
import { AdminManagementSection } from '@/components/user-management/adminManagement';
import { Card, CardContent } from '@/components/ui/card';
import * as api from '../../api';

interface Props {
  // eslint-disable-next-line react/no-unused-prop-types
  toggleDarkMode: () => void;
  // eslint-disable-next-line react/no-unused-prop-types
  doneLoading: () => void;
  navigate: NavigateFunction;
}

function AdminPanel(props: Props) {
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
          title: localize.settingsPage.userManagement.messageBox.errorTitle,
          message: localize.settingsPage.userManagement.messageBox.userGetError,
        });
      } else {
        if (res.data === undefined) throw Error('Unreachable');
        setUsers(res.data);
      }
    });
  }, [
    localize.settingsPage.userManagement.messageBox.errorTitle,
    localize.settingsPage.userManagement.messageBox.userGetError,
  ]);

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
        setFormData({
          username: '',
          email: '',
          password: '',
          isAdmin: false,
          displayName: '',
        });
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
          <h1 className="text-2xl font-bold">
            {localize.settingsPage.userManagement.title}
          </h1>
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
        <h1 className="text-2xl font-bold">
          {localize.settingsPage.categories.userManagement.shortTitle}
        </h1>
        <div className="mt-6">
          <AdminManagementSection users={users} handleUserFetch={fetchUsers} />
        </div>
        <hr className="my-5 text-gray-600 dark:text-gray-400 border-1" />
        <h1 className="text-2xl font-bold">
          {localize.settingsPage.userManagement.userCreationTitle}
        </h1>
        <div className="mt-6">
          <Card>
            <CardContent className="pt-2">
              <form onSubmit={createUser} className="space-y-2">
                <div className="space-y-2">
                  <Label htmlFor="username">
                    {localize.settingsPage.userManagement.createUser.username}
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder={
                      localize.settingsPage.userManagement.createUser
                        .usernamePlaceholder
                    }
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    {localize.settingsPage.userManagement.createUser.email}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={
                      localize.settingsPage.userManagement.createUser
                        .emailPlaceholder
                    }
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="displayName">
                    {
                      localize.settingsPage.userManagement.createUser
                        .displayName
                    }
                  </Label>
                  <Input
                    id="displayName"
                    type="displayName"
                    value={formData.displayName}
                    onChange={handleChange}
                    placeholder={
                      localize.settingsPage.userManagement.createUser
                        .displayNamePlaceholder
                    }
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="isAdmin">
                    {localize.settingsPage.userManagement.createUser.admin}
                  </Label>
                  <Switch
                    id="isAdmin"
                    checked={formData.isAdmin}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({
                        ...prev,
                        isAdmin: checked,
                      }))
                    }
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
export default asPage(AdminPanel, false);
