import User from './users';
import Room, { setupRoomAssociations } from "./rooms";
import RoomUser, { setupRoomUserAssociations } from "./roomUsers";
import RoomMedia, { setupRoomMediaAssociations } from "./roomMedia";

export default function setupAssociations() {
  setupRoomAssociations();
  setupRoomUserAssociations();
  setupRoomMediaAssociations();
}

export { User, Room, RoomUser, RoomMedia };