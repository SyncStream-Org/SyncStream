# SyncStream API

> Version 1.0.0

API documentation for the SyncStream backend.

## Path Table

| Method | Path | Description |
| --- | --- | --- |
| PUT | [/admin/user/](#putadminuser) | Create user (admin only) |
| DELETE | [/admin/user/{user}](#deleteadminuseruser) | Delete user (admin only) |
| GET | [/admin/rooms/](#getadminrooms) | Get all rooms (admin only) |
| GET | [/admin/users/](#getadminusers) | Get all users (admin only) |
| POST | [/user/authenticate](#postuserauthenticate) | Authenticate user login |
| GET | [/user/](#getuser) | Get current user data |
| GET | [/user/all](#getuserall) | Get all usernames |
| PUT | [/user/update](#putuserupdate) | Update display name or password |
| GET | [/user/rooms](#getuserrooms) | Get all rooms or stream updates |
| GET | [/user/rooms/{roomID}/](#getuserroomsroomid) | Get user-specific room data |
| DELETE | [/user/rooms/{roomID}/](#deleteuserroomsroomid) | Leave room |
| PUT | [/user/rooms/{roomID}/invitation](#putuserroomsroomidinvitation) | Accept room invite |
| DELETE | [/user/rooms/{roomID}/invitation](#deleteuserroomsroomidinvitation) | Decline room invite |
| PUT | [/user/rooms/{roomID}/presence](#putuserroomsroomidpresence) | Add user to room presence, used for websockets |
| DELETE | [/user/rooms/presence](#deleteuserroomspresence) | Remove user from presence map |
| GET | [/user/presence](#getuserpresence) | Get presence (other users currently in that room) of all rooms user is apart of |
| PUT | [/rooms/](#putrooms) | Create a room |
| PUT | [/rooms/{roomID}](#putroomsroomid) | Update room name or ownership |
| DELETE | [/rooms/{roomID}](#deleteroomsroomid) | Delete a room |
| GET | [/rooms/{roomID}/users/](#getroomsroomidusers) | List all users in a room |
| PUT | [/rooms/{roomID}/users/](#putroomsroomidusers) | Invite user to room |
| DELETE | [/rooms/{roomID}/users/{username}](#deleteroomsroomidusersusername) | Remove user from room |
| PUT | [/rooms/{roomID}/users/{username}](#putroomsroomidusersusername) | Update user metadata for room |
| GET | [/rooms/{roomID}/media/](#getroomsroomidmedia) | Get metadata of room media or stream updates |
| PUT | [/rooms/{roomID}/media/](#putroomsroomidmedia) | Upload new media to room |
| GET | [/rooms/{roomID}/media/presence](#getroomsroomidmediapresence) | Get presence of all media for the room (users currently interacting with that media) |
| GET | [/rooms/{roomID}/media/{mediaID}](#getroomsroomidmediamediaid) | Get specific media metadata |
| PUT | [/rooms/{roomID}/media/{mediaID}](#putroomsroomidmediamediaid) | Update media metadata |
| DELETE | [/rooms/{roomID}/media/{mediaID}](#deleteroomsroomidmediamediaid) | Delete media |
| POST | [/echo](#postecho) | Ping-pong UUID echo |

## Reference Table

| Name | Path | Description |
| --- | --- | --- |
| StringMessage | [#/components/schemas/StringMessage](#componentsschemasstringmessage) |  |
| UserData | [#/components/schemas/UserData](#componentsschemasuserdata) |  |
| RoomsUserData | [#/components/schemas/RoomsUserData](#componentsschemasroomsuserdata) |  |
| UserUpdateData | [#/components/schemas/UserUpdateData](#componentsschemasuserupdatedata) |  |
| RoomPermissions | [#/components/schemas/RoomPermissions](#componentsschemasroompermissions) |  |
| InviteData | [#/components/schemas/InviteData](#componentsschemasinvitedata) |  |
| RoomData | [#/components/schemas/RoomData](#componentsschemasroomdata) |  |
| UserRoomData | [#/components/schemas/UserRoomData](#componentsschemasuserroomdata) |  |
| RoomUpdateData | [#/components/schemas/RoomUpdateData](#componentsschemasroomupdatedata) |  |
| PresenceData | [#/components/schemas/PresenceData](#componentsschemaspresencedata) |  |
| UserPresenceData | [#/components/schemas/UserPresenceData](#componentsschemasuserpresencedata) |  |
| UpdateType | [#/components/schemas/UpdateType](#componentsschemasupdatetype) |  |
| RoomBroadcastUpdate | [#/components/schemas/RoomBroadcastUpdate](#componentsschemasroombroadcastupdate) |  |
| UserBroadcastUpdate | [#/components/schemas/UserBroadcastUpdate](#componentsschemasuserbroadcastupdate) |  |
| MediaType | [#/components/schemas/MediaType](#componentsschemasmediatype) |  |
| MediaPermissions | [#/components/schemas/MediaPermissions](#componentsschemasmediapermissions) |  |
| MediaData | [#/components/schemas/MediaData](#componentsschemasmediadata) |  |
| MediaDataUpdate | [#/components/schemas/MediaDataUpdate](#componentsschemasmediadataupdate) |  |
| MediaPresenceData | [#/components/schemas/MediaPresenceData](#componentsschemasmediapresencedata) |  |

## Path Details

***

### [PUT]/admin/user/

- Summary  
Create user (admin only)

#### RequestBody

- application/json

```ts
{
  username: string
  email?: string
  password?: string
  admin?: boolean
  displayname?: string
}
```

#### Responses

- 200 User created with auto-generated password

`application/json`

```ts
{
  msg: string
}
```

- 400 Malformed body

- 403 Insufficient permissions

- 409 Conflict

***

### [DELETE]/admin/user/{user}

- Summary  
Delete user (admin only)

#### Responses

- 403 Insufficient permissions

- 404 User not found

***

### [GET]/admin/rooms/

- Summary  
Get all rooms (admin only)

#### Responses

- 200 Rooms returned

`application/json`

```ts
{
  roomName: string
  roomOwner?: string
  roomID?: string
  isMember?: boolean
}[]
```

- 204 No content

- 403 Insufficient permissions

***

### [GET]/admin/users/

- Summary  
Get all users (admin only)

#### Responses

- 200 Users returned

`application/json`

```ts
{
  username: string
  email?: string
  password?: string
  admin?: boolean
  displayname?: string
}[]
```

- 204 No content

- 403 Insufficient permissions

***

### [POST]/user/authenticate

- Summary  
Authenticate user login

#### RequestBody

- application/json

```ts
{
  username: string
  email?: string
  password?: string
  admin?: boolean
  displayname?: string
}
```

#### Responses

- 200 Session token returned, concatenated with a '+' and a boolean indicating if the user has an autogenerated password

`application/json`

```ts
{
  msg: string
}
```

- 400 Bad request format

- 401 Unauthorized credentials or user not found

***

### [GET]/user/

- Summary  
Get current user data

#### Responses

- 200 Successful user fetch

`application/json`

```ts
{
  username: string
  email?: string
  password?: string
  admin?: boolean
  displayname?: string
}
```

- 400 Bad request format

***

### [GET]/user/all

- Summary  
Get all usernames

#### Responses

- 200 List of usernames

`application/json`

```ts
string[]
```

- 204 No content

- 400 Bad request format

***

### [PUT]/user/update

- Summary  
Update display name or password

#### RequestBody

- application/json

```ts
{
  email?: string
  password?: string
  displayName?: string
}
```

#### Responses

- 200 Update successful

- 400 Bad request format

***

### [GET]/user/rooms

- Summary  
Get all rooms or stream updates

#### Parameters(Query)

```ts
stream?: boolean
```

#### Responses

- 200 Room list or SSE stream

`application/json`

```ts
{
  roomName: string
  roomOwner?: string
  roomID?: string
  isMember?: boolean
}[]
```

`text/event-stream`

```ts
{
  "type": "string"
}
```

- 204 No content

***

### [GET]/user/rooms/{roomID}/

- Summary  
Get user-specific room data

#### Responses

- 200 User room data

`application/json`

```ts
{
  roomData: {
    roomName: string
    roomOwner?: string
    roomID?: string
    isMember?: boolean
  }
  userPermissions: {
    admin: boolean
    canInviteUser: boolean
    canRemoveUser: boolean
  }
}
```

- 403 Forbidden

- 404 Room not found

***

### [DELETE]/user/rooms/{roomID}/

- Summary  
Leave room

#### Responses

- 200 Room left

- 403 Forbidden

- 404 Room not found

***

### [PUT]/user/rooms/{roomID}/invitation

- Summary  
Accept room invite

#### Responses

- 200 Invitation accepted

- 403 Forbidden

- 404 Room not found

***

### [DELETE]/user/rooms/{roomID}/invitation

- Summary  
Decline room invite

#### Responses

- 200 Invitation declined

- 403 Forbidden

- 404 Room not found

***

### [PUT]/user/rooms/{roomID}/presence

- Summary  
Add user to room presence, used for websockets

#### Responses

- 200 User added to presence

- 403 Forbidden

- 404 Room not found

- 409 User already in presence

***

### [DELETE]/user/rooms/presence

- Summary  
Remove user from presence map

#### Responses

- 200 User removed from presence

- 404 User presence not found

***

### [GET]/user/presence

- Summary  
Get presence (other users currently in that room) of all rooms user is apart of

#### Responses

- 200 Presence data

`application/json`

```ts
{
  mediaID: string
  users?: string[]
  isServerSet?: boolean
}[]
```

***

### [PUT]/rooms/

- Summary  
Create a room

#### RequestBody

- application/json

```ts
{
  msg: string
}
```

#### Responses

- 200 Room created

`application/json`

```ts
{
  roomName: string
  roomOwner?: string
  roomID?: string
  isMember?: boolean
}
```

- 400 Bad request

- 409 Conflict

***

### [PUT]/rooms/{roomID}

- Summary  
Update room name or ownership

#### RequestBody

- application/json

```ts
{
  newRoomName?: string
  newOwnerID?: string
}
```

#### Responses

- 200 Room updated

- 403 Forbidden

- 404 Room not found

***

### [DELETE]/rooms/{roomID}

- Summary  
Delete a room

#### Responses

- 200 Room deleted

- 403 Forbidden

- 404 Room not found

***

### [GET]/rooms/{roomID}/users/

- Summary  
List all users in a room

#### Responses

- 200 List of users

`application/json`

```ts
undefined?: #/components/schemas/UserData & {
   isMember: boolean
 }[]
```

- 400 Bad Request

- 404 Room or User not found

***

### [PUT]/rooms/{roomID}/users/

- Summary  
Invite user to room

#### RequestBody

- application/json

```ts
{
  username: string
  permissions: {
    admin: boolean
    canInviteUser: boolean
    canRemoveUser: boolean
  }
}
```

#### Responses

- 200 User invited

- 400 Bad request

- 409 Conflict

***

### [DELETE]/rooms/{roomID}/users/{username}

- Summary  
Remove user from room

#### Responses

- 200 User removed

- 403 Forbidden

- 404 Room or user not found

***

### [PUT]/rooms/{roomID}/users/{username}

- Summary  
Update user metadata for room

#### RequestBody

- application/json

```ts
{
  admin: boolean
  canInviteUser: boolean
  canRemoveUser: boolean
}
```

#### Responses

- 200 Permissions updated

- 400 Bad request

- 403 Forbidden

- 404 Room not found

***

### [GET]/rooms/{roomID}/media/

- Summary  
Get metadata of room media or stream updates

#### Parameters(Query)

```ts
stream?: boolean
```

#### Responses

- 200 Media metadata or SSE stream

`application/json`

```ts
{
  mediaID?: string
  mediaName: string
  mediaType: enum[doc, stream, voice]
  permissions: {
    canEdit: boolean
  }
}[]
```

`text/event-stream`

```ts
{
  "type": "string"
}
```

- 403 Forbidden

- 404 Room not found

***

### [PUT]/rooms/{roomID}/media/

- Summary  
Upload new media to room

#### RequestBody

- application/json

```ts
{
  mediaID?: string
  mediaName: string
  mediaType: enum[doc, stream, voice]
  permissions: {
    canEdit: boolean
  }
}
```

#### Responses

- 200 Media created

- 403 Forbidden

- 404 Room not found

***

### [GET]/rooms/{roomID}/media/presence

- Summary  
Get presence of all media for the room (users currently interacting with that media)

#### Responses

- 200 Presence data

`application/json`

```ts
{
  mediaID: string
  users?: string[]
  isServerSet?: boolean
}[]
```

- 403 Forbidden

- 404 Room not found

***

### [GET]/rooms/{roomID}/media/{mediaID}

- Summary  
Get specific media metadata

#### Responses

- 200 Media metadata

`application/json`

```ts
{
  mediaID?: string
  mediaName: string
  mediaType: enum[doc, stream, voice]
  permissions: {
    canEdit: boolean
  }
}
```

- 403 Forbidden

- 404 Room not found

***

### [PUT]/rooms/{roomID}/media/{mediaID}

- Summary  
Update media metadata

#### RequestBody

- application/json

```ts
{
  mediaName?: string
  mediaType?: enum[doc, stream, voice]
  permissions: {
    canEdit: boolean
  }
}
```

#### Responses

- 200 Media updated

- 403 Forbidden

- 404 Room not found

***

### [DELETE]/rooms/{roomID}/media/{mediaID}

- Summary  
Delete media

#### Responses

- 200 Media deleted

- 403 Forbidden

- 404 Room not found

***

### [POST]/echo

- Summary  
Ping-pong UUID echo

#### RequestBody

- application/json

```ts
{
  msg: string
}
```

#### Responses

- 200 Echoed response

`application/json`

```ts
{
  msg: string
}
```

## References

### #/components/schemas/StringMessage

```ts
{
  msg: string
}
```

### #/components/schemas/UserData

```ts
{
  username: string
  email?: string
  password?: string
  admin?: boolean
  displayname?: string
}
```

### #/components/schemas/RoomsUserData

```ts
{
  "allOf": [
    {
      "$ref": "#/components/schemas/UserData"
    },
    {
      "type": "object",
      "properties": {
        "isMember": {
          "type": "boolean"
        }
      },
      "required": [
        "isMember"
      ]
    }
  ]
}
```

### #/components/schemas/UserUpdateData

```ts
{
  email?: string
  password?: string
  displayName?: string
}
```

### #/components/schemas/RoomPermissions

```ts
{
  admin: boolean
  canInviteUser: boolean
  canRemoveUser: boolean
}
```

### #/components/schemas/InviteData

```ts
{
  username: string
  permissions: {
    admin: boolean
    canInviteUser: boolean
    canRemoveUser: boolean
  }
}
```

### #/components/schemas/RoomData

```ts
{
  roomName: string
  roomOwner?: string
  roomID?: string
  isMember?: boolean
}
```

### #/components/schemas/UserRoomData

```ts
{
  roomData: {
    roomName: string
    roomOwner?: string
    roomID?: string
    isMember?: boolean
  }
  userPermissions: {
    admin: boolean
    canInviteUser: boolean
    canRemoveUser: boolean
  }
}
```

### #/components/schemas/RoomUpdateData

```ts
{
  newRoomName?: string
  newOwnerID?: string
}
```

### #/components/schemas/PresenceData

```ts
{
  username: string
  mediaID: string
  isServerSet?: boolean
}
```

### #/components/schemas/UserPresenceData

```ts
{
  roomID?: string
  username?: string
}
```

### #/components/schemas/UpdateType

```ts
{
  "type": "string",
  "enum": [
    "create",
    "update",
    "delete"
  ]
}
```

### #/components/schemas/RoomBroadcastUpdate

```ts
{
  endpoint: enum[room, media, user, presence]
  type: enum[create, update, delete]
  data: #/components/schemas/MediaData | #/components/schemas/UserRoomData | #/components/schemas/RoomUpdateData | #/components/schemas/PresenceData
}
```

### #/components/schemas/UserBroadcastUpdate

```ts
{
  endpoint: enum[room, presence]
  type: enum[create, update, delete]
  data: #/components/schemas/RoomData | #/components/schemas/UserPresenceData
}
```

### #/components/schemas/MediaType

```ts
{
  "type": "string",
  "enum": [
    "doc",
    "stream",
    "voice"
  ]
}
```

### #/components/schemas/MediaPermissions

```ts
{
  canEdit: boolean
}
```

### #/components/schemas/MediaData

```ts
{
  mediaID?: string
  mediaName: string
  mediaType: enum[doc, stream, voice]
  permissions: {
    canEdit: boolean
  }
}
```

### #/components/schemas/MediaDataUpdate

```ts
{
  mediaName?: string
  mediaType?: enum[doc, stream, voice]
  permissions: {
    canEdit: boolean
  }
}
```

### #/components/schemas/MediaPresenceData

```ts
{
  mediaID: string
  users?: string[]
  isServerSet?: boolean
}
```