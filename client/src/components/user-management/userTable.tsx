import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';

interface UserTableProps {
  users: string[];
  selectedUsers: string[];
  toggleUserSelection: (username: string) => void;
  toggleSelectAll: () => void;
  loading: boolean;
}

export function UserTable({
  users,
  selectedUsers,
  toggleUserSelection,
  toggleSelectAll,
  loading,
}: UserTableProps) {
  const allSelected =
    users.length > 0 && users.every((user) => selectedUsers.includes(user));

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={allSelected}
                onCheckedChange={toggleSelectAll}
                disabled={loading || users.length === 0}
              />
            </TableHead>
            <TableHead>Username</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={2} className="h-24 text-center">
                {loading ? 'Loading...' : 'No users found'}
              </TableCell>
            </TableRow>
          ) : (
            users.map((username) => (
              <TableRow key={username}>
                <TableCell>
                  <Checkbox
                    checked={selectedUsers.includes(username)}
                    onCheckedChange={() => toggleUserSelection(username)}
                    disabled={loading}
                  />
                </TableCell>
                <TableCell>{username}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
