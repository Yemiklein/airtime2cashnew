import { DataTypes, Model } from 'sequelize';
import db from '../config/database.config';

interface SellAirtimeAttribute {
  id: string;
  network: string;
  phoneNumber: string;
  amountToSell: number;
  transactionStatus: boolean;
}

export class SellAirtimeInstance extends Model<SellAirtimeAttribute> {}

SellAirtimeInstance.init(
  {
    id: {
      type: DataTypes.UUIDV4,
      primaryKey: true,
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

    transactionStatus: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },

  {
    sequelize: db,
    tableName: 'SellAirtime',
  },
);
