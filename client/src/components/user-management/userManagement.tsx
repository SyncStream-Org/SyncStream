import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Types } from 'syncstream-sharedlib';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import * as api from '@/api';
import { TablePagination } from './userPagination';
import { UserTable } from './userTable';
import Localize from '@/utilities/localize';

interface UserManagementProps {
  room: Types.RoomData;
  usersInRoom: Types.RoomsUserData[];
  usersNotInRoom: Types.UserData[];
}

export function UserManagementSection({
  room,
  usersInRoom,
  usersNotInRoom,
}: UserManagementProps) {
  const [activeTab, setActiveTab] = useState('invite');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [allUsers, setAllUsers] = useState<
    (Types.UserData | Types.RoomsUserData)[]
  >([]);
  const [loading, setLoading] = useState(false);

  const localize = Localize.getInstance().localize();

  useEffect(() => {
    // Reset selections when tab changes
    setSelectedUsers([]);
    setCurrentPage(1);
    setSearchQuery('');

    if (activeTab === 'invite') {
      setAllUsers(usersNotInRoom);
    } else {
      setAllUsers(usersInRoom);
    }
  }, [activeTab, usersInRoom, usersNotInRoom]);

  // Pagination settings
  const usersPerPage = 5;

  // Filter users based on search
  const filteredUsers = allUsers.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Get current page users
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Toggle selection of a user
  const toggleUserSelection = (username: string) => {
    if (selectedUsers.includes(username)) {
      setSelectedUsers(selectedUsers.filter((user) => user !== username));
    } else {
      setSelectedUsers([...selectedUsers, username]);
    }
  };

  // Select all users on current page
  const toggleSelectAll = () => {
    if (selectedUsers.length === currentUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(currentUsers.map((user) => user.username));
    }
  };

  // Handle batch action
  const handleBatchAction = async () => {
    if (selectedUsers.length === 0) return;

    setLoading(true);
    try {
      if (activeTab === 'invite') {
        // Invite selected users
        for (const username of selectedUsers) {
          await api.Rooms.inviteUser(room.roomID!, { username });
        }
        window.electron.ipcRenderer.invokeFunction('show-message-box', {
          title: localize.roomPage.messageBox.successTitle,
          message: `${localize.roomPage.messageBox.inviteSuccess.Part1} ${selectedUsers.length} ${localize.roomPage.messageBox.inviteSuccess.Part2}`,
        });
      } else {
        // Remove selected users
        for (const username of selectedUsers) {
          await api.Rooms.removeUser(room.roomID!, username);
        }
        window.electron.ipcRenderer.invokeFunction('show-message-box', {
          title: localize.roomPage.messageBox.successTitle,
          message: `${localize.roomPage.messageBox.removedSuccess.Part1} ${selectedUsers.length} ${localize.roomPage.messageBox.removedSuccess.Part2}`,
        });
      }

      // Reset selection and refresh list
      setSelectedUsers([]);
    } catch (error) {
      window.electron.ipcRenderer.invokeFunction('show-message-box', {
        title: localize.roomPage.messageBox.errorTitle,
        message: `${localize.roomPage.messageBox.inviteRemoveError.Part1} ${
          activeTab === 'invite'
            ? localize.roomPage.messageBox.inviteRemoveError.invite
            : localize.roomPage.messageBox.inviteRemoveError.remove
        } ${localize.roomPage.messageBox.inviteRemoveError.Part2} ${
          error.message
        }`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 space-y-4">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
        {localize.roomPage.roomSettings.userManagment.title}
      </h2>

      <Tabs
        defaultValue="invite"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="invite">
            {localize.roomPage.roomSettings.userManagment.invite}
          </TabsTrigger>
          <TabsTrigger value="remove">
            {localize.roomPage.roomSettings.userManagment.remove}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="invite" className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                placeholder={
                  localize.roomPage.roomSettings.userManagment
                    .searchUsersPlaceholder
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button
              onClick={handleBatchAction}
              disabled={selectedUsers.length === 0 || loading}
            >
              {localize.roomPage.roomSettings.userManagment.inviteSelected} (
              {selectedUsers.length})
            </Button>
          </div>

          <UserTable
            users={currentUsers}
            selectedUsers={selectedUsers}
            toggleUserSelection={toggleUserSelection}
            toggleSelectAll={toggleSelectAll}
            loading={loading}
          />

          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </TabsContent>

        <TabsContent value="remove" className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                placeholder={
                  localize.roomPage.roomSettings.userManagment
                    .searchMembersPlaceholder
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button
              onClick={handleBatchAction}
              disabled={selectedUsers.length === 0 || loading}
              variant="destructive"
            >
              {localize.roomPage.roomSettings.userManagment.removeSelected} (
              {selectedUsers.length})
            </Button>
          </div>

          <UserTable
            users={currentUsers}
            member
            selectedUsers={selectedUsers}
            toggleUserSelection={toggleUserSelection}
            toggleSelectAll={toggleSelectAll}
            loading={loading}
          />

          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
