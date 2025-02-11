import { Model, DataTypes } from 'sequelize';
import sequelize from '../db';
import { RoomUserAttributes, RoomUserPermissions } from 'room-types';

class RoomUser extends Model<RoomUserAttributes> implements RoomUserAttributes {
  public username!: string;
  public roomID!: number;
  public permissions!: RoomUserPermissions;
  public isMember!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

RoomUser.init({
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  roomID: {
    type: DataTypes.INTEGER,
    allowNull: false,
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

export default RoomUser;
