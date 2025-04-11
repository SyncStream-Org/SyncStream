# API Documentation

This file documents the available endpoints in the Express API.


## Default URL After Starting Docker

```
http://localhost:80/ (inside the docker instance it is mapped to 3000)
```

---

## Server Expectations

If extending or altering the api from the server end, here are things to keep in mind:
1. Functionality is split between [routes](../server/src/routes/), [controllers](../server/src/controllers/), and [services](../server/src/services/). Routes Specifically give the API endpoints, and order of middleware for a router. Controllers handle status codes+messages, and setting up any data to be recieved by the client. Services interacts with the Database. 
2. Utilize the [ErrorCatcher](../server/src/middleware/ErrorCatcher.ts) to wrap any [routes](../server/src/routes/). This ensures there are no uncaught errors and the server can remain operational.
3. Update [SharedLib](../sharedLib/types) as these values are shared between the Client and Server.

## Client Expectations

Be aware to utilize [SuccessState](../client/src/api/types.ts) to classify incoming data from the server. All api wrapper functions are stored in the [src/api folder](../client/src/api/) of the client and should only take the neccesary parameters to complete the request. Use the [utility functions](../client/src/api/utilities.ts) to make the request generation consistent.

# All Routes: 
- [Server](../server/src/routes/) 
- [Client](../client/src/api) (the links below go to route's location in the server)
- [Request Body and Return Value Type Locations](../sharedLib/types)

## [Admin Routes](../server/src/routes/admin.routes.ts)

### `PUT /admin/user/`
- **Request Body**: `UserData{ALL}`
- **Returns**: `StringMessage{AutoGenPassword}`
- **Errors**: `400`, `403`, `409`
- **Description**: Create user 

### `DELETE /admin/user/{user}`
- **Returns**: None
- **Errors**: `403`, `404`
- **Description**: Delete user 

### `GET /admin/rooms/`
- **Returns**: `RoomData[]`
- **Errors**: `204`, `403`
- **Description**: Get all rooms on server

### `GET /admin/users/`
- **Returns**: `UserData{NoPass}[]`
- **Errors**: `204`, `403`
- **Description**: Get all users on server

---

## [User Routes](../server/src/routes/user.routes.ts)

### `POST /user/authenticate`
- **Request Body**: `UserData{username, password}`
- **Returns**: `StringMessage{SessionToken}`
- **Errors**: `400`, `401`
- **Description**: Authenticate a user login

### `GET /user/`
- **Returns**: `UserData{ALL}`
- **Errors**: `400`
- **Description**: Get current user data

### `GET /user/all`
- **Returns**: `UserData{username}`
- **Errors**: `204`, `400`
- **Description**: Get all usernames on server

### `PUT /user/update`
- **Request Body**: `UserUpdateData{AT LEAST ONE}`
- **Returns**: None
- **Errors**: `400`
- **Description**: Update display name and/or password

---

## [User Room Routes](../server/src/routes/user.routes.ts)

### `GET /user/rooms`
- **Returns**: `RoomData[]` or `204`
- **Errors**: `204`
- **Description**: Get all rooms associated with user

### `GET /user/rooms/{roomID}/`
- **Returns**: `UserRoomData`
- **Errors**: `403`, `404`
- **Description**: Get user-specific room information

### `DELETE /user/rooms/{roomID}/`
- **Returns**: None
- **Errors**: `403`, `404`
- **Description**: Leave/remove room

### `PUT /user/rooms/{roomID}/invitation`
- **Returns**: None
- **Errors**: `403`, `404`
- **Description**: Accept room invite

### `DELETE /user/rooms/{roomID}/invitation`
- **Returns**: None
- **Errors**: `403`, `404`
- **Description**: Decline room invite

### `PUT /user/rooms/{roomID}/presence`
- **Returns**: None
- **Errors**: `403`, `404`, `409`
- **Description**: Join room presence map (WebSocket)

### `DELETE /user/rooms/presence`
- **Returns**: None
- **Errors**: `404`
- **Description**: Leave presence map

---

## [Room Routes](../server/src/routes/rooms.routes.ts)

### `PUT /rooms/`
- **Request Body**: `StringMessage{roomName}`
- **Returns**: `RoomData`
- **Errors**: `400`, `409`
- **Description**: Create a new room

### `PUT /rooms/{roomID}`
- **Request Body**: `RoomUpdateData{?roomName, ?userID}`
- **Returns**: None
- **Errors**: `403`, `404`
- **Description**: Update room info

### `DELETE /rooms/{roomID}`
- **Returns**: None
- **Errors**: `403`, `404`
- **Description**: Delete a room

### `GET /rooms/{roomID}/users/`
- **Returns**: `RoomsUserData[]`
- **Errors**: `501`
- **Description**: List all users in room

### `PUT /rooms/{roomID}/users/`
- **Request Body**: `InviteData`
- **Returns**: None
- **Errors**: `400`, `409`
- **Description**: Invite user to room

### `DELETE /rooms/{roomID}/users/{username}`
- **Returns**: None
- **Errors**: `403`, `404`
- **Description**: Remove user from room

### `PUT /rooms/{roomID}/users/{username}`
- **Request Body**: `RoomPermissions`
- **Returns**: None
- **Errors**: `400`, `403`, `404`
- **Description**: Update user metadata for room

---

## [Room Media Routes](../server/src/routes/media.routes.ts)

### `GET /rooms/{roomID}/media/`
- **Returns**: `MediaData[]`
- **Errors**: `403`, `404`
- **Description**: List media metadata for a room

### `PUT /rooms/{roomID}/media/`
- **Request Body**: `MediaData (omit ID)`
- **Returns**: None
- **Errors**: `403`, `404`
- **Description**: Add new media to room

### `GET /rooms/{roomID}/media/{mediaID}`
- **Returns**: `MediaData`
- **Errors**: `403`, `404`
- **Description**: Get specific media metadata

### `PUT /rooms/{roomID}/media/{mediaID}`
- **Request Body**: `MediaDataUpdate`
- **Returns**: None
- **Errors**: `403`, `404`
- **Description**: Update room media

### `DELETE /rooms/{roomID}/media/{mediaID}`
- **Returns**: None
- **Errors**: `403`, `404`
- **Description**: Delete room media

---

## [Miscellaneous](../server/src/routes/misc.routes.ts)

### `POST /echo`
- **Request Body**: `StringMessage{UUID}`
- **Returns**: `StringMessage{"UUID+ServerVersion"}`
- **Description**: Ping, Pong, Echo test

---

## Server-Sent Events

### [`SSE /user/rooms`](../server/src/routes/user.routes.ts)
- **Description**: Room list update events

### [`SSE /rooms/{roomID}/media/`](../server/src/routes/rooms.routes.ts)
- **Errors**: `403`, `404`
- **Description**: Room media metadata update events
