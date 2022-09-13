import express, {Request, Response, NextFunction} from "express";
import {v4 as uuidv4} from "uuid"
import {signUpSchema, options} from "../utils/utils"
import {userInstance } from "../model/userModel"
import bcrypt from "bcryptjs"

export async function registerUser(req:Request, res:Response, next:NextFunction){
    const id = uuidv4()
    try{
        const validationResult = signUpSchema.validate(req.body,options)
        if( validationResult.error){
            
            return res.status(400).json({
               Error:validationResult.error.details[0].message
            })
         }
        
        const duplicateEmail = await userInstance.findOne({where:{email:req.body.email}})
        if(duplicateEmail){
            return res.status(409).json({
            msg:"Email is used, please change email"
            })
        }
        

        const passwordHash = await bcrypt.hash(req.body.password,10)
        const record = await userInstance.create({ 
            id:id,
            firstName:req.body.firstName,
            lastName:req.body.lastName, 
            userName:req.body.userName,
            email:req.body.email,
            phoneNumber:req.body.phoneNumber,
            password:passwordHash,
            avatar:req.body.avatar,
            isVerified:req.body.isVerified
        })
        console.log('here')
        res.status(201).json({
            message: "Successfully created a user",
            record
        })

    }   catch(err){
            console.log(err)
            res.status(500).json({
            msg:"failed to register",
            route:'/register'
            })
        }
}




