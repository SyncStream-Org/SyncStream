import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Types } from 'syncstream-sharedlib';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Localize from '@/utilities/localize';
import { Time } from 'syncstream-sharedlib/utilities';
import { TablePagination } from './userPagination';
import { UserTable } from './userTable';
import * as api from '../../api';

interface UserManagementProps {
  users: Types.UserData[];
  handleUserFetch: () => void;
}

export function AdminManagementSection({
  users,
  handleUserFetch,
}: UserManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const localize = Localize.getInstance().localize();

  useEffect(() => {
    // Reset selections when tab changes
    setSelectedUsers([]);
    setCurrentPage(1);
    setSearchQuery('');
  }, [users]);

  // Pagination settings
  const usersPerPage = 5;

  // Filter users based on search
  const filteredUsers = users.filter((user) =>
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
      for (const username of selectedUsers) {
        await api.Admin.deleteUser(username);
      }
      Time.delay(100);
      handleUserFetch();
      setSelectedUsers([]);
      window.electron.ipcRenderer.invokeFunction('show-message-box', {
        title: 'Success',
        message: `Removed ${selectedUsers.length} users from the room.`,
      });
    } catch (error) {
      window.electron.ipcRenderer.invokeFunction('show-message-box', {
        title: 'Error',
        message: `Failed to remove users: ${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 space-y-4">
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
          variant="destructive"
          onClick={handleBatchAction}
          disabled={selectedUsers.length === 0 || loading}
        >
          Delete Selected ({selectedUsers.length})
        </Button>
      </div>

      <UserTable
        users={currentUsers}
        selectedUsers={selectedUsers}
        toggleUserSelection={toggleUserSelection}
        toggleSelectAll={toggleSelectAll}
        loading={loading}
        admin
      />

      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}
