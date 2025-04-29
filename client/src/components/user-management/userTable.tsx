import { Types } from 'syncstream-sharedlib';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

interface UserTableProps {
  users: (Types.RoomsUserData | Types.UserData)[];
  member?: boolean;
  admin?: boolean;
  selectedUsers: string[];
  toggleUserSelection: (username: string) => void;
  toggleSelectAll: () => void;
  loading: boolean;
}

export function UserTable({
  users,
  member,
  admin,
  selectedUsers,
  toggleUserSelection,
  toggleSelectAll,
  loading,
}: UserTableProps) {
  const allSelected =
    users.length > 0 &&
    users.every((user) => selectedUsers.includes(user.username));

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
            <TableHead>Display Name</TableHead>
            <TableHead>Email</TableHead>
            {member && <TableHead>Member</TableHead>}
            {admin && <TableHead>Admin</TableHead>}
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
            users.map((user) => (
              <TableRow key={user.username}>
                <TableCell>
                  <Checkbox
                    checked={selectedUsers.includes(user.username)}
                    onCheckedChange={() => toggleUserSelection(user.username)}
                    disabled={loading}
                  />
                </TableCell>
                <TableCell className="font-medium">{user.username}</TableCell>
                <TableCell>{user.displayName || '-'}</TableCell>
                <TableCell>{user.email || '-'}</TableCell>
                {member && (
                  <TableCell>
                    {(user as Types.RoomsUserData).isMember ? (
                      <Badge className="bg-green-500 hover:bg-green-600">
                        Member
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-gray-500">
                        Not Member
                      </Badge>
                    )}
                  </TableCell>
                )}
                {admin && (
                  <TableCell>
                    {(user as Types.UserData).admin ? (
                      <Badge className="bg-green-500 hover:bg-green-600">
                        Admin
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-gray-500">
                        Not Admin
                      </Badge>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
