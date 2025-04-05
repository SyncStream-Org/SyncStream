import User from './users';
import Room, { setupRoomAssociations } from "./rooms";
import RoomUser, { setupRoomUserAssociations } from "./roomUsers";
import RoomFile, { setupRoomFileAssociations } from "./roomFiles";

export default function setupAssociations() {
  setupRoomAssociations();
  setupRoomUserAssociations();
  setupRoomFileAssociations();
}

export { User, Room, RoomUser, RoomFile };