// All room routes

import { Types, Validation } from 'syncstream-sharedlib';
import {
  generateDefaultHeaders,
  generateRoute,
  printUnexpectedError,
} from '../utilities';
import { SuccessState } from '../types';

export function createRoom(roomName: string): Promise<{
  success: SuccessState;
  data?: Types.RoomData;
}> {
  const headers: Headers = generateDefaultHeaders();

  const data: Types.StringMessage = { msg: roomName };

  // eslint-disable-next-line no-undef
  const request: RequestInfo = new Request(generateRoute('rooms'), {
    method: 'PUT',
    headers,
    body: JSON.stringify(data),
  });

  return fetch(request)
    .then(async (res) => {
      if (res.ok) {
        const body = await res.json();

        // Validate
        if (!Validation.isRoomDataNoUserData(body))
          return { success: SuccessState.ERROR };

        return {
          success: SuccessState.SUCCESS,
          data: body as Types.RoomData,
        };
      }

      if (res.status === 409) {
        console.error('Create room failed: Room already exists.');
        return { success: SuccessState.FAIL };
      }

      printUnexpectedError('rooms API Call Failed', res);
      return { success: SuccessState.ERROR };
    })
    .catch((error) => {
      console.error(`Fetch Encountered an Error:\n${error}`);
      return { success: SuccessState.ERROR };
    });
}

export function joinRoom(roomId: string): Promise<{
  success: SuccessState;
  data?: any; // TODO: define room state
}> {
  const headers: Headers = generateDefaultHeaders();

  // eslint-disable-next-line no-undef
  const request: RequestInfo = new Request(generateRoute(`rooms/${roomId}`), {
    method: 'GET',
    headers,
  });

  return fetch(request)
    .then(async (res) => {
      if (res.ok) {
        const body = await res.json();
        // TODO: validate body later

        return {
          success: SuccessState.SUCCESS,
          data: body as any, // TODO: change to room state type
        };
      }

      printUnexpectedError('rooms/{roomId} GET API Call Failed', res);
      return { success: SuccessState.ERROR };
    })
    .catch((error) => {
      console.error(`Fetch Encountered an Error:\n${error}`);
      return { success: SuccessState.ERROR };
    });
}

export function updateRoom(
  roomId: string,
  updateData: Types.RoomUpdateData,
): Promise<SuccessState> {
  const headers: Headers = generateDefaultHeaders();

  // eslint-disable-next-line no-undef
  const request: RequestInfo = new Request(generateRoute(`rooms/${roomId}`), {
    method: 'DELETE',
    headers,
  });

  return fetch(request)
    .then(async (res) => {
      if (res.ok) return SuccessState.SUCCESS;

      if (res.status === 403) {
        console.error('Room delete request failed: User does not own room.');
        return SuccessState.FAIL;
      }

      if (res.status === 404) {
        console.error('Room delete request failed: Room does not exist.');
        return SuccessState.FAIL;
      }

      printUnexpectedError('rooms/{roomId} DELETE API Call Failed', res);
      return SuccessState.ERROR;
    })
    .catch((error) => {
      console.error(`Fetch Encountered an Error:\n${error}`);
      return SuccessState.ERROR;
    });
}

export function deleteRoom(roomId: string): Promise<SuccessState> {
  const headers: Headers = generateDefaultHeaders();

  // eslint-disable-next-line no-undef
  const request: RequestInfo = new Request(generateRoute(`rooms/${roomId}`), {
    method: 'DELETE',
    headers,
  });

  return fetch(request)
    .then(async (res) => {
      if (res.ok) return SuccessState.SUCCESS;

      if (res.status === 403) {
        console.error('Room delete request failed: User does not own room.');
        return SuccessState.FAIL;
      }

      if (res.status === 404) {
        console.error('Room delete request failed: Room does not exist.');
        return SuccessState.FAIL;
      }

      printUnexpectedError('rooms/{roomId} DELETE API Call Failed', res);
      return SuccessState.ERROR;
    })
    .catch((error) => {
      console.error(`Fetch Encountered an Error:\n${error}`);
      return SuccessState.ERROR;
    });
}

export function listMembers(roomId: string): Promise<{
  success: SuccessState;
  data?: Types.UserData[];
}> {
  const headers: Headers = generateDefaultHeaders();

  // eslint-disable-next-line no-undef
  const request: RequestInfo = new Request(
    generateRoute(`rooms/${roomId}/users`),
    {
      method: 'GET',
      headers,
    },
  );

  return fetch(request)
    .then(async (res) => {
      if (res.ok) {
        const body = await res.json();

        // Validate
        if (!(Object.prototype.toString.call(body) === '[object Array]'))
          return { success: SuccessState.ERROR };
        for (let i = 0; i < body.length; i += 1) {
          if (!Validation.isUserDataMinimum(body[i]))
            // TODO: may need to change later
            return { success: SuccessState.ERROR };
        }

        return {
          success: SuccessState.SUCCESS,
          data: body as Types.UserData[],
        };
      }

      printUnexpectedError('rooms/{roomId}/users GET API Call Failed', res);
      return { success: SuccessState.ERROR };
    })
    .catch((error) => {
      console.error(`Fetch Encountered an Error:\n${error}`);
      return { success: SuccessState.ERROR };
    });
}

export function inviteUser(
  roomId: string,
  inviteData: Types.InviteData,
): Promise<SuccessState> {
  const headers: Headers = generateDefaultHeaders();

  // eslint-disable-next-line no-undef
  const request: RequestInfo = new Request(
    generateRoute(`rooms/${roomId}/users`),
    {
      method: 'PUT',
      headers,
      body: JSON.stringify(inviteData),
    },
  );

  return fetch(request)
    .then(async (res) => {
      if (res.ok) return SuccessState.SUCCESS;

      if (res.status === 409) {
        console.error(
          'Invite user request failed: Invite already exists or user is already a member.',
        );
        return SuccessState.FAIL;
      }

      printUnexpectedError('rooms/{roomId}/users PUT API Call Failed', res);
      return SuccessState.ERROR;
    })
    .catch((error) => {
      console.error(`Fetch Encountered an Error:\n${error}`);
      return SuccessState.ERROR;
    });
}

export function removeUser(
  roomId: string,
  username: string,
): Promise<SuccessState> {
  const headers: Headers = generateDefaultHeaders();

  // eslint-disable-next-line no-undef
  const request: RequestInfo = new Request(
    generateRoute(`rooms/${roomId}/users/${username}`),
    {
      method: 'DELETE',
      headers,
    },
  );

  return fetch(request)
    .then(async (res) => {
      if (res.ok) return SuccessState.SUCCESS;

      if (res.status === 403) {
        console.error(
          'Remove user from room request failed: You do not have permission to do this.',
        );
        return SuccessState.FAIL;
      }

      if (res.status === 404) {
        console.error(
          'Remove user from room request failed: Room or user does not exist.',
        );
        return SuccessState.FAIL;
      }

      printUnexpectedError(
        'rooms/{roomId}/users/{user} DELETE API Call Failed',
        res,
      );
      return SuccessState.ERROR;
    })
    .catch((error) => {
      console.error(`Fetch Encountered an Error:\n${error}`);
      return SuccessState.ERROR;
    });
}

export function updateUserRoomPermissions(
  roomId: string,
  username: string,
  newPermissions: Types.RoomPermissions,
): Promise<SuccessState> {
  const headers: Headers = generateDefaultHeaders();

  // eslint-disable-next-line no-undef
  const request: RequestInfo = new Request(
    generateRoute(`rooms/${roomId}/users/${username}`),
    {
      method: 'PUT',
      headers,
      body: JSON.stringify(newPermissions),
    },
  );

  return fetch(request)
    .then(async (res) => {
      if (res.ok) return SuccessState.SUCCESS;

      if (res.status === 403) {
        console.error(
          'Update user room permissions request failed: You do not have permission to do this.',
        );
        return SuccessState.FAIL;
      }

      if (res.status === 404) {
        console.error(
          'Update user room permissions request failed: Room or user does not exist.',
        );
        return SuccessState.FAIL;
      }

      printUnexpectedError(
        'rooms/{roomId}/users/{user} PUT API Call Failed',
        res,
      );
      return SuccessState.ERROR;
    })
    .catch((error) => {
      console.error(`Fetch Encountered an Error:\n${error}`);
      return SuccessState.ERROR;
    });
}

export function transferOwnership(
  roomId: string,
  username: string,
): Promise<SuccessState> {
  const headers: Headers = generateDefaultHeaders();

  // eslint-disable-next-line no-undef
  const request: RequestInfo = new Request(
    generateRoute(`rooms/${roomId}/users/${username}/transferOwnership`),
    {
      method: 'PUT',
      headers,
    },
  );

  return fetch(request)
    .then(async (res) => {
      if (res.ok) return SuccessState.SUCCESS;

      if (res.status === 403) {
        console.error(
          'Room ownership transfer request failed: You do not have permission to do this.',
        );
        return SuccessState.FAIL;
      }

      if (res.status === 404) {
        console.error(
          'Room ownership transfer request failed: Room or user does not exist.',
        );
        return SuccessState.FAIL;
      }

      printUnexpectedError(
        'rooms/{roomId}/users/{user}/transferOwnership API Call Failed',
        res,
      );
      return SuccessState.ERROR;
    })
    .catch((error) => {
      console.error(`Fetch Encountered an Error:\n${error}`);
      return SuccessState.ERROR;
    });
}
