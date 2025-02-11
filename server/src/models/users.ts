import { Model, DataTypes } from 'sequelize';
import sequelize from '../db';
import { UserAttributes } from 'user-types';

class User extends Model<UserAttributes> implements UserAttributes {
  public username!: string;
  public password!: string;
  public admin!: boolean;
  public displayName!: string;
  public email!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
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
  // set the displayName as the username by default
  hooks: {
    beforeCreate: (user: User) => {
      if (!user.displayName) {
        user.displayName = user.username;
      }
    },
  },
}
);

export default User;