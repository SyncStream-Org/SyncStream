// Holds data and functions used in api

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
