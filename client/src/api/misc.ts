import { Echo } from 'types_shared';

export default function echo(): Promise<boolean> {
  const headers: Headers = new Headers();
  headers.set('Content-Type', 'application/json');
  headers.set('Accept', 'application/json');

  // Define junk json to send
  const junk: Echo = {
    msg: 'This is a test',
  };

  // eslint-disable-next-line no-undef
  const request: RequestInfo = new Request('./users.json', {
    // TODO: change to server URL
    method: 'GET',
    headers,
    body: JSON.stringify(junk),
  });

  return fetch(request)
    .then((res) => res.json())
    .then((res) => {
      const response = res as Echo;
      return response.msg === junk.msg;
    });
}
