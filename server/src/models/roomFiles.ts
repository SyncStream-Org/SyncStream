import { Model, DataTypes } from 'sequelize';
import sequelize from '../db';
import { RoomFileAttributes, RoomFilePermissions } from 'room-types';

class RoomFile extends Model<RoomFileAttributes> implements RoomFileAttributes {
  public fileName!: string;
  public roomID!: number;
  public fileExtension!: string;
  public permissions!: RoomFilePermissions;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
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
