import UserService from '../../src/services/userService';
import * as auth from '../../src/utils/auth';
import User from '../../src/models/users';

jest.mock('../../src/models/users');
jest.mock('../../src/utils/auth');

describe('UserService', () => {
  test('createUser', async () => {
    const mockUser = {
      username: 'testuser',
      password: 'password123',
      email: 'testuser@gmail.com',
      admin: false,
      displayName: 'Test User',
    };
    const originalPassword = mockUser.password;
    const mockHashedPassword = 'hashedpassword123';

    jest.spyOn(auth, 'hashPassword').mockResolvedValue(mockHashedPassword);
    jest.spyOn(User, 'create').mockResolvedValue(true);

    const result = await UserService.createUser(mockUser);

    expect(auth.hashPassword).toHaveBeenCalledWith(originalPassword);
    expect(result).toBe(true);
  });
});