// ALl admin routes

import { Types, Validation } from 'syncstream-sharedlib';
import { generateDefaultHeaders, generateRoute, SuccessState } from '../api';

export function createUser(
  username: string,
  email: string,
  password: string,
  admin: boolean,
  displayName: string,
): Promise<{
  success: SuccessState;
  data?: string;
}> {
  const headers: Headers = generateDefaultHeaders();

  // Define message to send
  const data: Types.UserData = {
    username,
    email,
    password,
    admin,
    displayName,
  };

  // eslint-disable-next-line no-undef
  const request: RequestInfo = new Request(generateRoute('admin/user'), {
    method: 'PUT',
    headers,
    body: JSON.stringify(data),
  });

  return fetch(request).then(async (res) => {
    if (res.ok) {
      const body = await res.json();
      if (!Validation.isValidStringMessage(body))
        return { success: SuccessState.ERROR };

      return {
        success: SuccessState.SUCCESS,
        data: (body as Types.StringMessage).msg,
      };
    }

    if (res.status === 403) {
      console.error('Creating user failed: Not admin.');
      return { success: SuccessState.FAIL };
    }

    if (res.status === 409) {
      console.error('Creating user failed: User already exists.');
      return { success: SuccessState.FAIL };
    }

    console.error(`admin/user API Call Failed: ${res.status}; ${res.status}`);
    return { success: SuccessState.ERROR };
  });
}

export function deleteUser(username: string): Promise<SuccessState> {
  const headers: Headers = generateDefaultHeaders();

  // eslint-disable-next-line no-undef
  const request: RequestInfo = new Request(
    generateRoute(`admin/user/${username}`),
    {
      method: 'DELETE',
      headers,
    },
  );

  return fetch(request).then(async (res) => {
    if (res.ok) return SuccessState.SUCCESS;

    if (res.status === 403) {
      console.error('Deleting user failed: Not admin.');
      return SuccessState.FAIL;
    }

    if (res.status === 404) {
      console.error('Deleting user failed: User not found.');
      return SuccessState.FAIL;
    }

    console.error(
      `admin/user/{username} API Call Failed: ${res.status}; ${res.status}`,
    );
    return SuccessState.ERROR;
  });
}

export function getAllRooms(): Promise<{
  success: SuccessState;
  data?: Types.RoomData[];
}> {
  const headers: Headers = generateDefaultHeaders();

  // eslint-disable-next-line no-undef
  const request: RequestInfo = new Request(generateRoute('admin/rooms'), {
    method: 'GET',
    headers,
  });

  return fetch(request).then(async (res) => {
    if (res.status === 200) {
      const body = await res.json();
      // TODO: validate body later

      return {
        success: SuccessState.SUCCESS,
        data: body as Types.RoomData[],
      };
    }

    if (res.status === 204) {
      return {
        success: SuccessState.SUCCESS,
        data: [],
      };
    }

    if (res.status === 403) {
      console.error('Get all rooms failed: Not admin.');
      return { success: SuccessState.FAIL };
    }

    console.error(`admin/rooms API Call Failed: ${res.status}; ${res.status}`);
    return { success: SuccessState.ERROR };
  });
}
