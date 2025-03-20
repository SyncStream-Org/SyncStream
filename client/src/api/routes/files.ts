import { Types, Validation } from 'syncstream-sharedlib';
import {
  generateDefaultHeaders,
  generateRoute,
  printUnexpectedError,
} from '../utilities';
import { SuccessState } from '../types';

export function getAllRoomFiles(roomID: string): Promise<{
  success: SuccessState;
  data?: Types.FileData[];
}> {
  const headers: Headers = generateDefaultHeaders();

  // eslint-disable-next-line no-undef
  const request: RequestInfo = new Request(
    generateRoute(`rooms/${roomID}/files`),
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
          if (!Validation.isFileData(body[i])) {
            return { success: SuccessState.ERROR };
          }
        }

        return {
          success: SuccessState.SUCCESS,
          data: body as Types.FileData[],
        };
      }

      if (res.status === 204) {
        return {
          success: SuccessState.SUCCESS,
          data: [],
        };
      }

      printUnexpectedError('rooms/{roomID}/markdown failed', res);
      return { success: SuccessState.ERROR };
    })
    .catch((error) => {
      console.error(`Fetch Encountered an Error:\n${error}`);
      return { success: SuccessState.ERROR };
    });
}

export function createFile(
  roomID: string,
  fileData: Types.FileData,
): Promise<{
  success: SuccessState;
  data?: Types.FileData;
}> {
  const headers: Headers = generateDefaultHeaders();

  // eslint-disable-next-line no-undef
  const request: RequestInfo = new Request(
    generateRoute(`rooms/${roomID}/files`),
    {
      method: 'PUT',
      headers,
      body: JSON.stringify(fileData),
    },
  );

  return fetch(request)
    .then(async (res) => {
      if (res.status === 200) {
        const body = await res.json();

        if (!Validation.isFileData(body)) {
          return { success: SuccessState.ERROR };
        }

        return {
          success: SuccessState.SUCCESS,
          data: body as Types.FileData,
        };
      }

      if (res.status === 400) {
        console.error('Create file failed: Bad Request.');
        return { success: SuccessState.FAIL };
      }

      printUnexpectedError('rooms/{roomID}/files failed', res);
      return { success: SuccessState.ERROR };
    })
    .catch((error) => {
      console.error(`Fetch Encountered an Error:\n${error}`);
      return { success: SuccessState.ERROR };
    });
}

export function getRoomFile(
  roomID: string,
  fileName: string,
): Promise<{
  success: SuccessState;
  data?: Types.FileData;
}> {
  const headers: Headers = generateDefaultHeaders();

  // eslint-disable-next-line no-undef
  const request: RequestInfo = new Request(
    generateRoute(`rooms/${roomID}/files/${fileName}`),
    {
      method: 'GET',
      headers,
    },
  );

  return fetch(request)
    .then(async (res) => {
      if (res.status === 200) {
        const body = await res.json();

        if (!Validation.isFileData(body)) {
          return { success: SuccessState.ERROR };
        }

        return {
          success: SuccessState.SUCCESS,
          data: body as Types.FileData,
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

      printUnexpectedError('rooms/{roomID}/files/{fileName} failed', res);
      return { success: SuccessState.ERROR };
    })
    .catch((error) => {
      console.error(`Fetch Encountered an Error:\n${error}`);
      return { success: SuccessState.ERROR };
    });
}

export function updateRoomFile(
  roomID: string,
  fileName: string,
  fileData: Types.FileDataUpdate,
): Promise<SuccessState> {
  const headers: Headers = generateDefaultHeaders();

  // eslint-disable-next-line no-undef
  const request: RequestInfo = new Request(
    generateRoute(`rooms/${roomID}/files/${fileName}`),
    {
      method: 'PUT',
      headers,
      body: JSON.stringify(fileData),
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

      printUnexpectedError('rooms/{roomID}/files/{fileName} failed', res);
      return SuccessState.ERROR;
    })
    .catch((error) => {
      console.error(`Fetch Encountered an Error:\n${error}`);
      return SuccessState.ERROR;
    });
}

export function deleteRoomFile(
  roomID: string,
  fileName: string,
): Promise<SuccessState> {
  const headers: Headers = generateDefaultHeaders();

  // eslint-disable-next-line no-undef
  const request: RequestInfo = new Request(
    generateRoute(`rooms/${roomID}/files/${fileName}`),
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

      printUnexpectedError('rooms/{roomID}/files/{fileName} failed', res);
      return SuccessState.ERROR;
    })
    .catch((error) => {
      console.error(`Fetch Encountered an Error:\n${error}`);
      return SuccessState.ERROR;
    });
}
