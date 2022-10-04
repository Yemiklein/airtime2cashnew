import { DataTypes, Model } from 'sequelize';
import db from '../config/database.config';

interface CreditAttribute {
    id: string;
    email: string;
    userId: string;
    amount: number;
  }
  
  export class CreditInstance extends Model<CreditAttribute> {}

CreditInstance.init(
  {
    id: {
        type: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
   email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    userId: {
        type: DataTypes.UUIDV4,
        allowNull: false,
      },
    amount: {
        type: DataTypes.NUMBER,
        allowNull: false,
      },
    },

  {
    sequelize: db,
    tableName: 'Credit',
  },
);
