// All user routes

import { Types, Validation } from 'shared';
import SessionState from '../../utilities/session-state';
import { generateDefaultHeaders, generateRoute } from '../api';

export function authenticate(
  username: string,
  password: string,
): Promise<boolean | null> {
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
    .then(
      (res) => {
        return res.json();
      },
      (res) => {
        if (res.status === 401) {
          console.error(`Authentication Failed: ${res.statusText}`);
          return false;
        }

        console.error(
          `Authenticate API Call Failed: ${res.status}; ${res.statusText}`,
        );
        return null;
      },
    )
    .then((res) => {
      if (res == null) return null;
      if (!Validation.isValidStringMessage(res)) return null;

      const response = res as Types.StringMessage;
      SessionState.getInstance().sessionToken = response.msg;
      return true;
    });
}

export function update(): Promise<any | string> {
  const headers: Headers = generateDefaultHeaders(false);

  // eslint-disable-next-line no-undef
  const request: RequestInfo = new Request(
    `${SessionState.getInstance().serverURL}/user/update`,
    {
      method: 'GET',
      headers,
    },
  );

  return fetch(request).then((res) => {
    if (res.ok) {
      return res.json(); // TODO: as TYPE
    }
    return res.statusText;
  });
}
