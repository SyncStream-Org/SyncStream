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
const version = pkg.version;

export function echo(): Promise<SuccessState> {
  const headers: Headers = generateDefaultHeaders(false);

  // Define message to send
  const uuid: Types.StringMessage = {
    msg: Random.generateUUID(), // Generate UUID for test so static cant fake it
  };

  // eslint-disable-next-line no-undef
  const request: RequestInfo = new Request(generateRoute('echo'), {
    method: 'POST',
    headers,
    body: JSON.stringify(uuid),
  });

  return fetch(request)
    .then(async (res) => {
      if (res.ok) {
        const body = await res.json();
        if (!Validation.isStringMessage(body)) return SuccessState.ERROR;

        const response = (body as Types.StringMessage).msg.split("+");
        const resUUID = response[0];
        const serverVersion = response[1].split('.');
        if (resUUID !== uuid.msg) {
          return SuccessState.ERROR;
        }

        const clientVersion = version.toString().split('.');
        if (serverVersion[0] !== clientVersion[0] || serverVersion[1] < clientVersion[1]) {
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
