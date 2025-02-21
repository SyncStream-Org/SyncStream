import { Model, DataTypes } from 'sequelize';
import sequelize from '../db';
import { RoomFileAttributes, RoomFilePermissions } from 'room-types';

class RoomFile extends Model<RoomFileAttributes> implements RoomFileAttributes {
  declare fileName: string;
  declare roomID: number;
  declare fileExtension: string;
  declare permissions: RoomFilePermissions;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

RoomFile.init({
  fileName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fileExtension: {
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
},
{
  sequelize,
  tableName: 'RoomFiles',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['roomID', 'fileName', 'fileExtension'],
    },
  ],
}
);

export default RoomFile;
