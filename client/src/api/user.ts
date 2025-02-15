
// TODO: not implemented

export function authenticate(): Promise<any | string> {
  const headers: Headers = new Headers()
  headers.set('Content-Type', 'application/json')
  headers.set('Accept', 'application/json')
  // TODO: implement session token

  const request: RequestInfo = new Request('./users.json', {
    method: 'GET',
    headers: headers
  })

  return fetch(request)
    .then(res => {
      if (res.ok) {
        return res.json(); // TODO: as TYPE
      } else {
        return res.statusText;
      }
    })
}

export function update(): Promise<any | string> {
  const headers: Headers = new Headers()
  headers.set('Content-Type', 'application/json')
  headers.set('Accept', 'application/json')
  // TODO: implement session token

  const request: RequestInfo = new Request('./users.json', {
    method: 'GET',
    headers: headers
  })

  return fetch(request)
    .then(res => {
      if (res.ok) {
        return res.json(); // TODO: as TYPE
      } else {
        return res.statusText;
      }
    })
}