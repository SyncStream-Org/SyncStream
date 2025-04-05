import { Model, DataTypes } from 'sequelize';
import sequelize from '../db';
import { RoomUserAttributes, RoomUserPermissions } from 'room-types';
import Room from './rooms';
import User from './users';

class RoomUser extends Model<RoomUserAttributes> implements RoomUserAttributes {
  declare username: string;
  declare roomID: string;
  declare permissions: RoomUserPermissions;
  declare isMember: boolean;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

RoomUser.init({
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'username',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  roomID: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Rooms',
      key: 'roomID',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  permissions: {
    type: DataTypes.JSONB,
    allowNull: false,
  },
  isMember: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  }
},
{
  sequelize,
  tableName: 'RoomUsers',
  timestamps: true,
}
);

export function setupRoomUserAssociations() {
  RoomUser.belongsTo(Room, { foreignKey: 'roomID', targetKey: 'roomID' });
  RoomUser.belongsTo(User, { foreignKey: 'username', targetKey: 'username' });
  Room.hasMany(RoomUser, { foreignKey: 'roomID', sourceKey: 'roomID' });
  User.hasMany(RoomUser, { foreignKey: 'username', sourceKey: 'username' });
}

export default RoomUser;
