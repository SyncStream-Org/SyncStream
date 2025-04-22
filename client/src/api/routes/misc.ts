// ALl misc routes

import { Types, Validation } from 'syncstream-sharedlib';
import { Random } from 'syncstream-sharedlib/utilities';
import {
  generateDefaultHeaders,
  generateRoute,
  printUnexpectedError,
} from '../utilities';
import { SuccessState } from '../types';
import pkg from '../../../package.json';

const { version } = pkg;

export function echo(): Promise<SuccessState> {
  const headers: Headers = generateDefaultHeaders(false);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2000); // 2 seconds

  // Define message to send
  const uuid: Types.StringMessage = {
    msg: Random.generateUUID(), // Generate UUID for test so static cant fake it
  };

  // eslint-disable-next-line no-undef
  const request: RequestInfo = new Request(generateRoute('echo'), {
    method: 'POST',
    signal: controller.signal,
    headers,
    body: JSON.stringify(uuid),
  });

  return fetch(request, { signal: AbortSignal.timeout(1500) })
    .then(async (res) => {
      clearTimeout(timeout);
      if (res.ok) {
        const body = await res.json();
        if (!Validation.isStringMessage(body)) return SuccessState.ERROR;

        const response = (body as Types.StringMessage).msg.split('+');
        const resUUID = response[0];
        const serverVersion = response[1].split('.');
        if (resUUID !== uuid.msg) {
          return SuccessState.ERROR;
        }

        const clientVersion = version.toString().split('.');
        if (
          serverVersion[0] !== clientVersion[0] ||
          serverVersion[1] < clientVersion[1]
        ) {
          return SuccessState.FAIL; // show client incompatible versions
        }

        return SuccessState.SUCCESS;
      }

      printUnexpectedError('echo API Call Failed', res);
      return SuccessState.ERROR;
    })
    .catch((error) => {
      console.error(`Fetch Encountered an Error:\n${error}`);
      return SuccessState.ERROR;
    });
}
