import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Types } from 'syncstream-sharedlib';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import * as api from '@/api';
import { TablePagination } from './userPagination';
import { UserTable } from './userTable';

interface UserManagementProps {
  room: Types.RoomData;
  usersInRoom: Types.RoomsUserData[];
  usersNotInRoom: Types.UserData[];
}

export function UserManagementSection({ room, usersInRoom, usersNotInRoom }: UserManagementProps) {
  const [activeTab, setActiveTab] = useState('invite');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [allUsers, setAllUsers] = useState<(Types.UserData | Types.RoomsUserData)[]>([]);
  const [loading, setLoading] = useState(false);

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
          title: 'Success',
          message: `Invited ${selectedUsers.length} users to the room.`,
        });
      } else {
        // Remove selected users
        for (const username of selectedUsers) {
          await api.Rooms.removeUser(room.roomID!, username);
        }
        window.electron.ipcRenderer.invokeFunction('show-message-box', {
          title: 'Success',
          message: `Removed ${selectedUsers.length} users from the room.`,
        });
      }

      // Reset selection and refresh list
      setSelectedUsers([]);
    } catch (error) {
      window.electron.ipcRenderer.invokeFunction('show-message-box', {
        title: 'Error',
        message: `Failed to ${
          activeTab === 'invite' ? 'invite' : 'remove'
        } users: ${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 space-y-4">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
        User Management
      </h2>

      <Tabs
        defaultValue="invite"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="invite">Invite Users</TabsTrigger>
          <TabsTrigger value="remove">Remove Users</TabsTrigger>
        </TabsList>

        <TabsContent value="invite" className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                placeholder="Search users by username..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button
              onClick={handleBatchAction}
              disabled={selectedUsers.length === 0 || loading}
            >
              Invite Selected ({selectedUsers.length})
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
                placeholder="Search room members..."
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
              Remove Selected ({selectedUsers.length})
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
