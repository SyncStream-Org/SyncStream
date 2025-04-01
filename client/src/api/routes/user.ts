// All user routes

import { Types, Validation } from 'syncstream-sharedlib';
import SessionState from '../../utilities/session-state';
import {
  generateDefaultHeaders,
  generateRoute,
  printUnexpectedError,
} from '../utilities';
import { SuccessState } from '../types';

export function authenticate(
  username: string,
  password: string,
): Promise<SuccessState> {
  const headers: Headers = generateDefaultHeaders(false);

  const data: Types.UserData = {
    username,
    password,
  };

  // eslint-disable-next-line no-undef
  const request: RequestInfo = new Request(generateRoute('user/authenticate'), {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });

  return fetch(request)
    .then(async (res) => {
      if (res.ok) {
        const body = await res.json();
        if (!Validation.isStringMessage(body)) return SuccessState.ERROR;

        const response = body as Types.StringMessage;
        SessionState.getInstance().sessionToken = response.msg;
        return SuccessState.SUCCESS;
      }

      if (res.status === 401) {
        const body = await res.json();
        console.error(`Authentication Failed: ${body.error}`);
        return SuccessState.FAIL;
      }

      printUnexpectedError('user/authenticate API Call Failed', res);
      return SuccessState.ERROR;
    })
    .catch((error) => {
      console.error(`Fetch Encountered an Error:\n${error}`);
      return SuccessState.ERROR;
    });
}

export function getCurrentUser(): Promise<{
  success: SuccessState;
  data?: Types.UserData;
}> {
  const headers: Headers = generateDefaultHeaders();

  // eslint-disable-next-line no-undef
  const request: RequestInfo = new Request(generateRoute('user'), {
    method: 'GET',
    headers,
  });

  return fetch(request)
    .then(async (res) => {
      if (res.ok) {
        const body = await res.json();
        if (!Validation.isUserDataNoPass(body))
          return { success: SuccessState.ERROR };

        const response = body as Types.UserData;
        return { success: SuccessState.SUCCESS, data: response };
      }

      printUnexpectedError('user/authenticate API Call Failed', res);
      return { success: SuccessState.ERROR };
    })
    .catch((error) => {
      console.error(`Fetch Encountered an Error:\n${error}`);
      return { success: SuccessState.ERROR };
    });
}

export function getAllUsers(): Promise<{
  success: SuccessState;
  data?: Types.UserData[];
}> {
  const headers: Headers = generateDefaultHeaders();

  // eslint-disable-next-line no-undef
  const request: RequestInfo = new Request(generateRoute('user/all'), {
    method: 'GET',
    headers,
  });

  return fetch(request)
    .then(async (res) => {
      if (res.status === 200) {
        const body = await res.json();

        // Validate
        if (!(Object.prototype.toString.call(body) === '[object Array]'))
          return { success: SuccessState.ERROR };
        for (let i = 0; i < body.length; i += 1) {
          if (!Validation.isUserDataMinimum(body[i]))
            return { success: SuccessState.ERROR };
        }

        return {
          success: SuccessState.SUCCESS,
          data: body as Types.UserData[],
        };
      }

      if (res.status === 204) {
        return {
          success: SuccessState.SUCCESS,
          data: [],
        };
      }

      if (res.status === 403) {
        console.error('Get all users failed: No permisions.');
        return { success: SuccessState.FAIL };
      }

      printUnexpectedError('user/users API Call Failed', res);
      return { success: SuccessState.ERROR };
    })
    .catch((error) => {
      console.error(`Fetch Encountered an Error:\n${error}`);
      return { success: SuccessState.ERROR };
    });
}

export function updateUser(data: Types.UserUpdateData): Promise<SuccessState> {
  const headers: Headers = generateDefaultHeaders();

  // eslint-disable-next-line no-undef
  const request: RequestInfo = new Request(generateRoute('user/update'), {
    method: 'PUT',
    headers,
    body: JSON.stringify(data),
  });

  return fetch(request)
    .then(async (res) => {
      if (res.ok) return SuccessState.SUCCESS;

      printUnexpectedError('user/update API Call Failed', res);
      return SuccessState.ERROR;
    })
    .catch((error) => {
      console.error(`Fetch Encountered an Error:\n${error}`);
      return SuccessState.ERROR;
    });
}

export function getRooms(): Promise<{
  success: SuccessState;
  data?: Types.RoomData[];
}> {
  const headers: Headers = generateDefaultHeaders();

  // eslint-disable-next-line no-undef
  const request: RequestInfo = new Request(generateRoute('user/rooms'), {
    method: 'GET',
    headers,
  });

  return fetch(request)
    .then(async (res) => {
      if (res.status === 200) {
        const body = await res.json();

        // Validate
        if (!(Object.prototype.toString.call(body) === '[object Array]'))
          return { success: SuccessState.ERROR };
        for (let i = 0; i < body.length; i += 1) {
          if (!Validation.isRoomDataNoUserData(body[i]))
            return { success: SuccessState.ERROR };
        }

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

      printUnexpectedError('user/rooms GET API Call Failed', res);
      return { success: SuccessState.ERROR };
    })
    .catch((error) => {
      console.error(`Fetch Encountered an Error:\n${error}`);
      return { success: SuccessState.ERROR };
    });
}

export function getUserDataForRoom(roomId: string): Promise<{
  success: SuccessState;
  data?: Types.UserRoomData;
}> {
  const headers: Headers = generateDefaultHeaders();

  // eslint-disable-next-line no-undef
  const request: RequestInfo = new Request(
    generateRoute(`user/rooms/${roomId}`),
    {
      method: 'GET',
      headers,
    },
  );

  return fetch(request)
    .then(async (res) => {
      if (res.ok) {
        const body = await res.json();

        if (!Validation.isUserRoomData(body))
          return { success: SuccessState.ERROR };

        return {
          success: SuccessState.SUCCESS,
          data: body as Types.UserRoomData,
        };
      }

      if (res.status === 403) {
        console.error(
          'User data for room request failed: User is not part of requested room.',
        );
        return { success: SuccessState.FAIL };
      }

      if (res.status === 404) {
        console.error(
          'User data for room request failed: Room does not exist.',
        );
        return { success: SuccessState.FAIL };
      }

      printUnexpectedError('user/rooms/{roomID} GET API Call Failed', res);
      return { success: SuccessState.ERROR };
    })
    .catch((error) => {
      console.error(`Fetch Encountered an Error:\n${error}`);
      return { success: SuccessState.ERROR };
    });
}

export function leaveRoom(roomId: string): Promise<SuccessState> {
  const headers: Headers = generateDefaultHeaders();

  // eslint-disable-next-line no-undef
  const request: RequestInfo = new Request(
    generateRoute(`user/rooms/${roomId}`),
    {
      method: 'DELETE',
      headers,
    },
  );

  return fetch(request)
    .then(async (res) => {
      if (res.ok) return SuccessState.SUCCESS;

      if (res.status === 403) {
        console.error('Room leave request failed: User is not in room');
        return SuccessState.FAIL;
      }

      if (res.status === 404) {
        console.error('Room leave request failed: Room does not exist.');
        return SuccessState.FAIL;
      }

      printUnexpectedError('user/rooms/{roomId} DELETE API Call Failed', res);
      return SuccessState.ERROR;
    })
    .catch((error) => {
      console.error(`Fetch Encountered an Error:\n${error}`);
      return SuccessState.ERROR;
    });
}

export function acceptInviteToRoom(roomId: string): Promise<SuccessState> {
  const headers: Headers = generateDefaultHeaders();

  // eslint-disable-next-line no-undef
  const request: RequestInfo = new Request(
    generateRoute(`user/rooms/${roomId}/invitation`),
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
          'Accepting invite to room failed: User has not been invited to the room.',
        );
        return SuccessState.FAIL;
      }

      if (res.status === 404) {
        console.error('Accepting invite to room failed: Room does not exist.');
        return SuccessState.FAIL;
      }

      printUnexpectedError(
        'user/rooms/{roomID}/invitation PUT API Call Failed',
        res,
      );
      return SuccessState.ERROR;
    })
    .catch((error) => {
      console.error(`Fetch Encountered an Error:\n${error}`);
      return SuccessState.ERROR;
    });
}

export function declineInviteToRoom(roomId: string): Promise<SuccessState> {
  const headers: Headers = generateDefaultHeaders();

  // eslint-disable-next-line no-undef
  const request: RequestInfo = new Request(
    generateRoute(`user/rooms/${roomId}/invitation`),
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
          'Declining invite to room failed: User is not invited to this room.',
        );
        return SuccessState.FAIL;
      }

      if (res.status === 404) {
        console.error('Declining invite to room failed: Room does not exist.');
        return SuccessState.FAIL;
      }

      printUnexpectedError(
        'user/rooms/{roomId}/invitation DELETE API Call Failed',
        res,
      );
      return SuccessState.ERROR;
    })
    .catch((error) => {
      console.error(`Fetch Encountered an Error:\n${error}`);
      return SuccessState.ERROR;
    });
}
