// All user routes

import SessionState from '../../utilities/session-state';
import { generateDefaultHeaders } from '../api';

export function authenticate(): Promise<any | string> {
  const headers: Headers = generateDefaultHeaders(false);

  // eslint-disable-next-line no-undef
  const request: RequestInfo = new Request(
    `${SessionState.getInstance().serverURL}/user/authenticate`,
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
