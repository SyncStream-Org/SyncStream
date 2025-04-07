import { Model, DataTypes, literal } from 'sequelize';
import sequelize from '../db';
import { RoomMediaAttributes, RoomMediaCreationAttributes, RoomMediaPermissions } from 'room-types';
import Room from './rooms';

class RoomMedia extends Model<RoomMediaAttributes, RoomMediaCreationAttributes> implements RoomMediaAttributes {
  declare mediaID: string;
  declare mediaName: string;
  declare roomID: string;
  declare mediaType: string;
  declare permissions: RoomMediaPermissions;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

RoomMedia.init({
  mediaID: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: literal('gen_random_uuid()'),
  },
  mediaName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mediaType: {
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
  tableName: 'RoomMedia',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['roomID', 'mediaName', 'mediaType'],
    },
  ],
}
);

export function setupRoomMediaAssociations() {
  RoomMedia.belongsTo(Room, { foreignKey: 'roomID', targetKey: 'roomID' });
  Room.hasMany(RoomMedia, { foreignKey: 'roomID', sourceKey: 'roomID', hooks: true });
}
export default RoomMedia;
