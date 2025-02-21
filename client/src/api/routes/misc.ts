// ALl misc routes

import { Types, Validation } from 'syncstream-sharedlib';
import { generateUUID } from '../../utilities/random';
import { generateDefaultHeaders, generateRoute } from '../api';

export default function echo(): Promise<boolean | null> {
  const headers: Headers = generateDefaultHeaders(false);

  // Define message to send
  const uuid: Types.StringMessage = {
    msg: generateUUID(), // Generate UUID for test so static cant fake it
  };

  // eslint-disable-next-line no-undef
  const request: RequestInfo = new Request(generateRoute('echo'), {
    method: 'POST',
    headers,
    body: JSON.stringify(uuid),
  });

  return fetch(request)
    .then(
      async (res) => {
        let body = await res.json();

        if (res.ok) {
          if (!Validation.isValidStringMessage(body)) return null;

          const response = body as Types.StringMessage;
          return response.msg === uuid.msg;
        }

        console.error(`Echo API Call Failed: ${res.status}; ${body.error}`);
        return null;
      }
    );
}
