import express, {Request, Response, NextFunction} from "express";
import {v4 as uuidv4} from "uuid"
import {signUpSchema, options} from "../utils/utils"
import {userInstance } from "../model/userModel"
import {emailTemplate} from "./emailController"
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
            isVerified:req.body.isVerified,
            token:req.body.token
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



export async function forgetPassword (req:Request, res:Response, next:NextFunction){
    try{
        const {email} = req.body
        const user = await userInstance.findOne({where:{email:email}})
        if(!user){
            return res.status(404).json({
                msg:"User not found"
            })
        }
        const token = uuidv4()
        const resetPasswordToken = await userInstance.update({token},{where:{email:email}})
        const link = `${process.env.FRONTEND_URL}/reset/${token}`;
        const emailData = {
            to:email,
            subject:"Password Reset", 
            html:` <div style="max-width: 700px;text-align: center; text-transform: uppercase;
            margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
            <h2 style="color: teal;">Welcome To Zen Health Therapy</h2>
            <p>Please Follow the link by clicking on the button to verify your email
             </p>
             <div style='text-align:center ;'>
               <a href=${link}
              style="background: #277BC0; text-decoration: none; color: white;
               padding: 10px 20px; margin: 10px 0;
              display: inline-block;">Click here</a>
             </div>
          </div>`
        }
        emailTemplate(emailData,res,req)
        res.status(200).json({
            msg:"Reset password token sent to your email",
            token
        })
    }catch(err){
        console.log(err)
        res.status(500).json({
            msg:"failed to send reset password token",
            route:'/forgetPassword'
        })
    }
}




export async function resetPassword (req:Request, res:Response, next:NextFunction){
    try{
        const {token, password} = req.body
        const user = await userInstance.findOne({where:{token}})
        if(!user){
            return res.status(404).json({
                msg:"User not found"
            })
        }
        const passwordHash = await bcrypt.hash(password,10)
        const resetPassword = await userInstance.update({password:passwordHash},{where:{token}})
        res.status(200).json({
            msg:"Password reset successfully",
            resetPassword
        })
    }catch(err){
        console.log(err)
        res.status(500).json({
            msg:"failed to reset password",
            route:'/resetPassword'
        })
    }
}