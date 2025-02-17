import { Echo } from "shared-type"
import "../../../shared/types/types_shared"
import * as admin from "./admin"
import * as rooms from "./rooms"
import * as user from "./user"


export function echo(): Promise<boolean> {
  const headers: Headers = new Headers()
  headers.set('Content-Type', 'application/json')
  headers.set('Accept', 'application/json')

  // Define junk json to send
  const junk: Echo = {
    msg: "This is a test"
  }

  const request: RequestInfo = new Request('./users.json', { // TODO: change to server URL
    method: 'GET',
    headers: headers,
    body: JSON.stringify(junk)
  })

  return fetch(request)
    .then(res => res.json())
    .then(res => {
      const response = res as Echo;
      return response.msg == junk.msg;
    })
}

export * as api from "./api";