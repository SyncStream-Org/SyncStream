// TODO: incomplete

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

export function deleteRoom(): Promise<any | string> {
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

export function createRoom(): Promise<any | string> {
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

export function inviteUser(): Promise<any | string> {
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

export function removeUser(): Promise<any | string> {
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

export function updateUser(): Promise<any | string> {
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

export function listUsers(): Promise<any | string> {
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

export function acceptInvite(): Promise<any | string> {
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

export function joinRoom(): Promise<any | string> {
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
