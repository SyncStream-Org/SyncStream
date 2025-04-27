import { Types, Validation } from 'syncstream-sharedlib';
import {
  generateDefaultHeaders,
  generateRoute,
  printUnexpectedError,
} from '../utilities';
import { SuccessState } from '../types';

export function getAllRoomMedia(roomID: string): Promise<{
  success: SuccessState;
  data?: Types.MediaData[];
}> {
  const headers: Headers = generateDefaultHeaders();

  // eslint-disable-next-line no-undef
  const request: RequestInfo = new Request(
    generateRoute(`rooms/${roomID}/media`),
    {
      method: 'GET',
      headers,
    },
  );

  return fetch(request)
    .then(async (res) => {
      if (res.status === 200) {
        const body = await res.json();

        for (let i = 0; i < body.length; i += 1) {
          if (!Validation.isMediaData(body[i])) {
            return { success: SuccessState.ERROR };
          }
        }

        return {
          success: SuccessState.SUCCESS,
          data: body as Types.MediaData[],
        };
      }

      if (res.status === 204) {
        return {
          success: SuccessState.SUCCESS,
          data: [],
        };
      }

      printUnexpectedError('rooms/{roomID}/media failed', res);
      return { success: SuccessState.ERROR };
    })
    .catch((error) => {
      console.error(`Fetch Encountered an Error:\n${error}`);
      return { success: SuccessState.ERROR };
    });
}

export function createMedia(
  roomID: string,
  MediaData: Types.MediaData,
): Promise<{
  success: SuccessState;
  data?: Types.MediaData;
}> {
  const headers: Headers = generateDefaultHeaders();

  // eslint-disable-next-line no-undef
  const request: RequestInfo = new Request(
    generateRoute(`rooms/${roomID}/media`),
    {
      method: 'PUT',
      headers,
      body: JSON.stringify(MediaData),
    },
  );

  return fetch(request)
    .then(async (res) => {
      if (res.status === 200) {
        const body = await res.json();

        if (!Validation.isMediaData(body)) {
          return { success: SuccessState.ERROR };
        }

        return {
          success: SuccessState.SUCCESS,
          data: body as Types.MediaData,
        };
      }

      if (res.status === 400) {
        console.error('Create file failed: Bad Request.');
        return { success: SuccessState.FAIL };
      }

      printUnexpectedError('rooms/{roomID}/media failed', res);
      return { success: SuccessState.ERROR };
    })
    .catch((error) => {
      console.error(`Fetch Encountered an Error:\n${error}`);
      return { success: SuccessState.ERROR };
    });
}

export function getRoomMedia(
  roomID: string,
  mediaID: string,
): Promise<{
  success: SuccessState;
  data?: Types.MediaData;
}> {
  const headers: Headers = generateDefaultHeaders();

  // eslint-disable-next-line no-undef
  const request: RequestInfo = new Request(
    generateRoute(`rooms/${roomID}/media/${mediaID}`),
    {
      method: 'GET',
      headers,
    },
  );

  return fetch(request)
    .then(async (res) => {
      if (res.status === 200) {
        const body = await res.json();

        if (!Validation.isMediaData(body)) {
          return { success: SuccessState.ERROR };
        }

        return {
          success: SuccessState.SUCCESS,
          data: body as Types.MediaData,
        };
      }

      if (res.status === 400) {
        console.error('Get file failed: Bad Request.');
        return { success: SuccessState.FAIL };
      }

      if (res.status === 404) {
        console.error('Get file failed: Not Found.');
        return { success: SuccessState.FAIL };
      }

      printUnexpectedError('rooms/{roomID}/media/{mediaID} failed', res);
      return { success: SuccessState.ERROR };
    })
    .catch((error) => {
      console.error(`Fetch Encountered an Error:\n${error}`);
      return { success: SuccessState.ERROR };
    });
}

export function updateRoomMedia(
  roomID: string,
  mediaID: string,
  MediaData: Types.MediaDataUpdate,
): Promise<SuccessState> {
  const headers: Headers = generateDefaultHeaders();

  // eslint-disable-next-line no-undef
  const request: RequestInfo = new Request(
    generateRoute(`rooms/${roomID}/media/${mediaID}`),
    {
      method: 'PUT',
      headers,
      body: JSON.stringify(MediaData),
    },
  );

  return fetch(request)
    .then(async (res) => {
      if (res.status === 204) return SuccessState.SUCCESS;

      if (res.status === 400) {
        console.error('Update file failed: Bad Request.');
        return SuccessState.FAIL;
      }

      if (res.status === 404) {
        console.error('Update file failed: Not Found.');
        return SuccessState.FAIL;
      }

      printUnexpectedError('rooms/{roomID}/media/{mediaID} failed', res);
      return SuccessState.ERROR;
    })
    .catch((error) => {
      console.error(`Fetch Encountered an Error:\n${error}`);
      return SuccessState.ERROR;
    });
}

export function deleteRoomMedia(
  roomID: string,
  mediaID: string,
): Promise<SuccessState> {
  const headers: Headers = generateDefaultHeaders();

  // eslint-disable-next-line no-undef
  const request: RequestInfo = new Request(
    generateRoute(`rooms/${roomID}/media/${mediaID}`),
    {
      method: 'DELETE',
      headers,
    },
  );

  return fetch(request)
    .then(async (res) => {
      if (res.status === 204) return SuccessState.SUCCESS;

      if (res.status === 404) {
        console.error('Delete file failed: Not Found.');
        return SuccessState.FAIL;
      }

      printUnexpectedError('rooms/{roomID}/media/{mediaID} failed', res);
      return SuccessState.ERROR;
    })
    .catch((error) => {
      console.error(`Fetch Encountered an Error:\n${error}`);
      return SuccessState.ERROR;
    });
}

export function getRoomMediaPresence(roomID: string): Promise<{
  success: SuccessState;
  data?: Types.MediaPresenceData[];
}> {
  const headers: Headers = generateDefaultHeaders();

  // eslint-disable-next-line no-undef
  const request: RequestInfo = new Request(
    generateRoute(`rooms/${roomID}/media/presence`),
    {
      method: 'GET',
      headers,
    },
  );

  return fetch(request)
    .then(async (res) => {
      if (res.status === 200) {
        const body = await res.json();

        for (let i = 0; i < body.length; i += 1) {
          if (!Validation.isMediaPresenceData(body[i])) {
            return { success: SuccessState.ERROR };
          }
        }

        return {
          success: SuccessState.SUCCESS,
          data: body as Types.MediaPresenceData[],
        };
      }

      if (res.status === 204) {
        return {
          success: SuccessState.SUCCESS,
          data: [],
        };
      }

      printUnexpectedError('rooms/{roomID}/media/presence failed', res);
      return { success: SuccessState.ERROR };
    })
    .catch((error) => {
      console.error(`Fetch Encountered an Error:\n${error}`);
      return { success: SuccessState.ERROR };
    });
}
