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
import Localize from '@/utilities/localize';

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

  const localize = Localize.getInstance().localize();

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
            <TableHead>
              {localize.settingsPage.userManagement.createUser.username}
            </TableHead>
            <TableHead>
              {localize.settingsPage.userManagement.createUser.displayName}
            </TableHead>
            <TableHead>
              {localize.settingsPage.userManagement.createUser.email}
            </TableHead>
            {member && (
              <TableHead>
                {localize.settingsPage.userManagement.adminManagement.member}
              </TableHead>
            )}
            {admin && (
              <TableHead>
                {localize.settingsPage.userManagement.adminManagement.admin}
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={2} className="h-24 text-center">
                {loading
                  ? localize.settingsPage.userManagement.adminManagement.loading
                  : localize.settingsPage.userManagement.adminManagement
                      .noUsers}
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
                        {
                          localize.settingsPage.userManagement.adminManagement
                            .member
                        }
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-gray-500">
                        {
                          localize.settingsPage.userManagement.adminManagement
                            .notMember
                        }
                      </Badge>
                    )}
                  </TableCell>
                )}
                {admin && (
                  <TableCell>
                    {(user as Types.UserData).admin ? (
                      <Badge className="bg-green-500 hover:bg-green-600">
                        {
                          localize.settingsPage.userManagement.adminManagement
                            .admin
                        }
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-gray-500">
                        {
                          localize.settingsPage.userManagement.adminManagement
                            .notAdmin
                        }
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
