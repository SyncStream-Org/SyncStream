import { Model, DataTypes, literal } from 'sequelize';
import sequelize from '../db';
import { RoomAttributes, RoomCreationAttributes } from 'room-types';
import User from './users';

class Room extends Model<RoomAttributes, RoomCreationAttributes> implements RoomAttributes {
  declare roomID: string;
  declare roomName: string;
  declare roomOwner: string;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Room.init({
  roomID: {
    type: DataTypes.UUID,
    defaultValue: literal('gen_random_uuid()'),
    primaryKey: true,
  },
  roomName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  roomOwner: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'username',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
},
{
  sequelize,
  tableName: 'Rooms',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['roomName', 'roomOwner'],
    }
  ]
}
);

export function setupRoomAssociations() {
  Room.belongsTo(User, { foreignKey: 'roomOwner', targetKey: 'username' });
  User.hasMany(Room, { foreignKey: 'roomOwner', sourceKey: 'username' });
}

export default Room;
