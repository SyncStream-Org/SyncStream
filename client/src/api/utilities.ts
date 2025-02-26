// Internal utility functions for the api

import { Types, Validation } from 'syncstream-sharedlib';
import SessionState from '../utilities/session-state';

export function generateDefaultHeaders(
  withSessionToken: boolean = true,
): Headers {
  const headers: Headers = new Headers();
  headers.set('Content-Type', 'application/json');
  headers.set('Accept', 'application/json');

  if (withSessionToken)
    headers.set('Session-Token', SessionState.getInstance().sessionToken);

  return headers;
}

export function generateRoute(route: string) {
  return `${SessionState.getInstance().serverURL}/${route}`;
}

export async function printUnexpectedError(msg: string, res: Response) {
  if (res.body !== null) {
    const data = await res.json();

    if (Validation.isErrorMessage(data)) {
      const emsg: Types.ErrorMessage = data as Types.ErrorMessage;
      console.error(
        `${msg}: ${res.status}; ${emsg.msg} - ${emsg.relevantData}`,
      );
      return;
    }

    if (Validation.isStringMessage(data)) {
      const smsg: Types.StringMessage = data as Types.StringMessage;
      console.error(`${msg}: ${res.status}; ${smsg.msg}`);
      return;
    }
  }

  console.error(`${msg}: ${res.status}; ${res.statusText}`);
}
