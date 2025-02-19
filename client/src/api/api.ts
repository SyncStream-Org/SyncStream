// Holds data and functions used in api

export let serverURL = 'http://localhost'; // TODO: Hard coded, make sure to change later
export let sessionToken = '';

export function generateDefaultHeaders(
  withSessionToken: boolean = true,
): Headers {
  const headers: Headers = new Headers();
  headers.set('Content-Type', 'application/json');
  headers.set('Accept', 'application/json');

  if (withSessionToken) headers.set('Session-Token', sessionToken);

  return headers;
}
