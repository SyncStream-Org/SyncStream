// All user routes

import { generateDefaultHeaders, serverURL } from '../api';

export function authenticate(): Promise<any | string> {
  const headers: Headers = generateDefaultHeaders(false);

  // eslint-disable-next-line no-undef
  const request: RequestInfo = new Request(`${serverURL}/user/authenticate`, {
    method: 'GET',
    headers,
  });

  return fetch(request).then((res) => {
    if (res.ok) {
      return res.json(); // TODO: as TYPE
    }
    return res.statusText;
  });
}

export function update(): Promise<any | string> {
  const headers: Headers = new Headers();
  headers.set('Content-Type', 'application/json');
  headers.set('Accept', 'application/json');
  // TODO: implement session token

  // eslint-disable-next-line no-undef
  const request: RequestInfo = new Request('./users.json', {
    method: 'GET',
    headers,
  });

  return fetch(request).then((res) => {
    if (res.ok) {
      return res.json(); // TODO: as TYPE
    }
    return res.statusText;
  });
}
