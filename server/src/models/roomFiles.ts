import { Model, DataTypes, literal } from 'sequelize';
import sequelize from '../db';
import { RoomFileAttributes, RoomFileCreationAttributes, RoomFilePermissions } from 'room-types';
import Room from './rooms';

class RoomFile extends Model<RoomFileAttributes, RoomFileCreationAttributes> implements RoomFileAttributes {
  declare fileID: string;
  declare fileName: string;
  declare roomID: string;
  declare fileExtension: string;
  declare permissions: RoomFilePermissions;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

RoomFile.init({
  fileID: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: literal('gen_random_uuid()'),
  },
  fileName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fileExtension: {
    type: DataTypes.STRING,
    allowNull: false,
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

export function setupRoomFileAssociations() {
  RoomFile.belongsTo(Room, { foreignKey: 'roomID', targetKey: 'roomID' });
  Room.hasMany(RoomFile, { foreignKey: 'roomID', sourceKey: 'roomID', hooks: true });
}
export default RoomFile;
