import { DataTypes, Model } from "sequelize";
import db from "../config/database.config"


interface userAttributes{
    id:string;
    firstName:string;
    lastName:string;
    userName:string;
    email:string;
    phoneNumber:string;
    password:string;
    confirmPassword:string;
    avatar:string;
    isVerified:Boolean
}

export class userInstance extends Model<userAttributes>{}

userInstance.init({
    id:{
    type:DataTypes.UUIDV4,
    primaryKey:true,
    allowNull:false,
    },
firstName: {
    type:DataTypes.STRING,
    allowNull:false,
    validate:{
    notNull:{
            msg:"full name is required"
            },
    notEmpty:{
            msg:"Please provide full name"
            }
    }
},
lastName:{
    type:DataTypes.STRING,
    allowNull:false,
    validate:{
    notNull:{
            msg:"last name is required"
            },
    notEmpty:{
            msg:"Please provide last name"
            }
    }
},
userName:{
    type:DataTypes.STRING,
    allowNull:false,
    validate:{
    notNull:{
            msg:"last name is required"
            },
    notEmpty:{
            msg:"Please provide last name"
            }
    }
},
email:{
    type:DataTypes.STRING,
    allowNull:false, 
    unique: true,
    validate:{
    notNull:{
            msg:"email is required"
            },
    isEmail:{
            msg:"Please provide a valid email"
            }
    }
}, 
phoneNumber:{
    type:DataTypes.STRING,
    allowNull:false
},
password:{
    type:DataTypes.STRING,
    allowNull:false, 
    unique: true,
    validate:{
        notNull:{
            msg:"password is required"
        },
        notEmpty:{
            msg:"Please provide a password"
        }
    }
},
confirmPassword:{
    type:DataTypes.STRING,
    allowNull:false, 
},
avatar:{
    type:DataTypes.STRING,
},
isVerified:{
    type:DataTypes.BOOLEAN,
} 
}, {
    sequelize: db,
    tableName:"Users"
})

