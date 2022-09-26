import { DataTypes, Model } from 'sequelize';
import db from '../config/database.config';
import {AccountInstance} from './accounts';
interface userAttributes {
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  phoneNumber: string;
  password: string;
  avatar: string;
  isVerified?: Boolean;
  token?: string;
}

export class userInstance extends Model<userAttributes> {
  [x: string]: any;
}

userInstance.init(
  {
    id: {
      type: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'full name is required',
        },
        notEmpty: {
          msg: 'Please provide full name',
        },
      },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'last name is required',
        },
        notEmpty: {
          msg: 'Please provide last name',
        },
      },
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: {
          msg: 'last name is required',
        },
        notEmpty: {
          msg: 'Please provide last name',
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: {
          msg: 'email is required',
        },
        isEmail: {
          msg: 'Please provide a valid email',
        },
      },
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: {
          msg: 'password is required',
        },
        notEmpty: {
          msg: 'Please provide a password',
        },
      },
    },
    avatar: {
      type: DataTypes.STRING,
      defaultValue:
        'https://static.vecteezy.com/system/resources/thumbnails/005/129/844/small/profile-user-icon-isolated-on-white-background-eps10-free-vector.jpg',
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    token: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
  },
  {
    sequelize: db,
    tableName: 'Users',
  },
);


userInstance.hasMany(AccountInstance, {foreignKey: 'userId', as: 'accounts'});
AccountInstance.belongsTo(userInstance, {foreignKey: 'userId', as: 'Users'});
