import { Types, Validation } from 'shared';
import { generateUUID } from '../../utilities/random';
import { generateDefaultHeaders, serverURL } from '../api';

export default function echo(): Promise<boolean | null> {
  const headers: Headers = generateDefaultHeaders(false);

  // Define message to send
  const uuid: Types.StringMessage = {
    msg: generateUUID(), // Generate UUID for test so static cant fake it
  };

  // eslint-disable-next-line no-undef
  const request: RequestInfo = new Request(`${serverURL}/echo`, {
    method: 'POST',
    headers,
    body: JSON.stringify(uuid),
  });

  return fetch(request)
    .then(
      (res) => {
        return res.json();
      },
      (res) => {
        console.error(`Echo API Call Failed: ${res.status}; ${res.statusText}`);
        return null;
      },
    )
    .then((res) => {
      if (res == null) return res;

      const response = res as Types.StringMessage;
      return response.msg === uuid.msg;
    });
}
