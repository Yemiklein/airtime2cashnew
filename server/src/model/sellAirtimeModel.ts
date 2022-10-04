import { DataTypes, Model } from 'sequelize';
import db from '../config/database.config';

interface SellAirtimeAttribute {
  id: string;
  userId: string;
  network: string;
  phoneNumber: string;
  amountToSell: number;
  amountToReceive: number;
  transactionStatus?: boolean;
}

export class SellAirtimeInstance extends Model<SellAirtimeAttribute> {}

SellAirtimeInstance.init(
  {
    id: {
      type: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },

    userId: {
      type: DataTypes.UUIDV4,
      // primaryKey: false,
      allowNull: false,
    },

    network: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    amountToSell: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },

     amountToReceive: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },

    transactionStatus: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "pending",
    },
  },

  {
    sequelize: db,
    tableName: 'SellAirtime',
  },
);
