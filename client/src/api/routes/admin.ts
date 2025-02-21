import { UserAttributes } from 'types_shared';

// TODO: incomplete

// TODO: change any to room list
export function getRooms(): Promise<any | string> {
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

export function createUser(): Promise<UserAttributes | string> {
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
      return res.json() as unknown as UserAttributes;
    }
    return res.statusText;
  });
}

export function deleteUser(): Promise<boolean | string> {
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
