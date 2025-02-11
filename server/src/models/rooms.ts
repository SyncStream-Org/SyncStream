import { Model, DataTypes } from 'sequelize';
import sequelize from '../db';
import { RoomAttributes, RoomCreationAttributes } from 'room-types';

class Room extends Model<RoomAttributes, RoomCreationAttributes> implements RoomAttributes {
  public roomID!: number;
  public roomName!: string;
  public roomOwner!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Room.init({
  roomID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  roomName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  roomOwner: {
    type: DataTypes.STRING,
    allowNull: false,
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

export default Room;
