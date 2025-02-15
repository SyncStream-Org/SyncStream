import { UserAttributes } from "shared-type"

// TODO: incomplete

// TODO: change any to room list
export function getRooms(): Promise<any | string> {
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

export function createUser(): Promise<UserAttributes | string> {
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
        return res.json() as unknown as UserAttributes;
      } else {
        return res.statusText;
      }
    })
}

export function deleteUser(): Promise<boolean | string> {
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