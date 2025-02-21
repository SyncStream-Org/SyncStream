import { Model, DataTypes } from 'sequelize';
import sequelize from '../db';
import { UserAttributes } from 'user-types';

class User extends Model<UserAttributes> implements UserAttributes {
  declare username: string;
  declare password: string;
  declare admin: boolean;
  declare displayName: string;
  declare email: string;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

User.init({
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    primaryKey: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  admin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  displayName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
},
{
  sequelize,
  tableName: 'Users',
  timestamps: true,
}
);

export default User;