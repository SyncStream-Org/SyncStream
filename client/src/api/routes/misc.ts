// ALl misc routes

import { Types, Validation } from 'syncstream-sharedlib';
import { Random } from 'syncstream-sharedlib/utilities';
import { generateDefaultHeaders, generateRoute, SuccessState } from '../api';

export default function echo(): Promise<SuccessState> {
  const headers: Headers = generateDefaultHeaders(false);

  // Define message to send
  const uuid: Types.StringMessage = {
    msg: Random.generateUUID(), // Generate UUID for test so static cant fake it
  };

  // eslint-disable-next-line no-undef
  const request: RequestInfo = new Request(generateRoute('echo'), {
    method: 'POST',
    headers,
    body: JSON.stringify(uuid),
  });

  return fetch(request).then(async (res) => {
    if (res.ok) {
      const body = await res.json();
      if (!Validation.isValidStringMessage(body)) return SuccessState.ERROR;

      const response = body as Types.StringMessage;
      return response.msg === uuid.msg
        ? SuccessState.SUCCESS
        : SuccessState.FAIL;
    }

    console.error(`echo API Call Failed: ${res.status}; ${res.status}`);
    return SuccessState.ERROR;
  });
}
