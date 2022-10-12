import express, { Request, Response, NextFunction } from 'express';
import { userInstance } from '../model/userModel';
import { creditSchema, options } from '../utils/utils';
import { v4 as uuidv4 } from 'uuid';
import { SellAirtimeInstance } from '../model/sellAirtimeModel';
import { emailTemplate, sendMail, tokenNotification } from './emailController';
import speakeasy from "speakeasy";
import { text } from 'body-parser';
const twofactor = require("node-2fa");

export async function credit(req: Request | any, res: Response, next: NextFunction) {
    const id = uuidv4()
    try {
            // const userID = req.user.id;
            const { email, amountToSend, status, transactionID} = req.body;

            // JOI VALIDATION
            const validatedInput = await creditSchema.validateAsync(req.body, options);
          if (validatedInput.error) {
            return res.status(400).json(validatedInput.error.details[0].message);
          }

        //  GET CUSTOMER BY EMAIL
          const customer = await userInstance.findOne({where: {email}})
          console.log(customer)

          if(!customer){
              return res.status(404).json({message:"customer not found"})
          }


        // CREDIT THE USER WALLET
          const newCustomerWalletBalance = customer.walletBalance + amountToSend;


          const getTransaction = await SellAirtimeInstance.findOne({
            where:{id:transactionID, transactionStatus:"pending"}
          })
          if(!getTransaction){
            return res.status(404).json({
                message:"Transaction not found",
                Transaction:getTransaction
            })
          }


          const updateStatus = await SellAirtimeInstance.update({
            transactionStatus:status},{where:{id:transactionID, amountToReceive:amountToSend}
          })

          if(status === 'sent'){
          const creditedCustomer = await userInstance.update({walletBalance:newCustomerWalletBalance}, {where:{email}});

          const link = `${process.env.FRONTEND_URL}/dashboard/admin`;
      const emailData = {
        to: `${process.env.ADMIN_EMAIL}`,
        subject: 'Payment Confirmed',
        html: ` <div style="max-width: 700px;text-align: center; text-transform: uppercase;
              margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
              <h2 style="color: teal;">Confirm Transaction</h2>
              <p>You successfully transfer N${amountToSend} to ${customer.firstName + ' ' + customer.lastName}</p>
              <p>Email: ${email}</p>
              <p>Phone Number: ${customer.phoneNumber}</p>
              <p>Login to get more details</p>
              <a href=${link}
              style="background: #277BC0; text-decoration: none; color: white;
               padding: 10px 20px; margin: 10px 0;
              display: inline-block;">Click here</a>

            </div>`,
      };
      emailTemplate(emailData);

      const link2 = `${process.env.FRONTEND_URL}/login`;
      const emailData2 = {
        to: `${process.env.ADMIN_EMAIL}`,
        subject: 'Payment Confirmed',
        html: ` <div style="max-width: 700px;text-align: center; text-transform: uppercase;
              margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
              <h2 style="color: teal;">Airtime2Cash Payment</h2>
              <p>You wallet has been credited successfully with N${amountToSend}</p>
              <p>Login to get more details</p>
              <a href=${link2}
              style="background: #277BC0; text-decoration: none; color: white;
               padding: 10px 20px; margin: 10px 0;
              display: inline-block;">Click here</a>
            </div>`,
      };
      emailTemplate(emailData2);

          return res.status(201).json({
              message:`You have successful credited ${email} with the sum of ${amountToSend}`
          });
        }else{
            return res.status(500).json({
                message:"Transaction Cancelled"
            })
        }

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message:"fail to credit customer wallet"
        })
    }
}

 // TWO FACTOR AUTHENTICATION

//  TO GENERATE A KEY
// export async function generate(req: Request | any, res: Response, next: NextFunction) {
  
//   // const id = uuidv4();
//   try {
//     const userId = req.user.id;

//     // const path = `/wallet/credit/${id}`;
//     // Create temporary secret until it it verified
//     const temp_secret = speakeasy.generateSecret({length:20}).base32
   
//     const admin = await userInstance.update({token:temp_secret},{ where: { id: userId } })
    
//     return res.status(201).json({ 
//       status:'generated',
//       userId,temp_secret, admin})
//   } catch(e) {
//     console.log(e);
//     res.status(500).json({ message: 'Error generating secret key'})
//   }
// }

// //TO VERIFY THE KEY

//   export async function verify(req: Request | any, res: Response, next: NextFunction) {
  
//     try {
//     const { token } = req.body;
//     // Retrieve user from database
//     const userId = req.user.id
//     const admin = await userInstance.findOne({where:{id:userId}}) as any;
//     const  secret = admin.dataValues.token
      
//     const verified = speakeasy.totp.verify({
//       secret,
//       encoding: 'base32',
//       token,
//     });
//     console.log(secret, verified)

    
//     if (verified) {
//       res.json({ verified: true })
//     } else {
//       res.json({ verified: false})
//     }
//   } catch(error) {
//     console.error(error);
//     res.status(500).json({ message: 'Error retrieving user'})
//   };
// }

export async function twoFactorAuth (req: Request, res: Response){
  try {
    const adminID = req.params.id;
    const user = await userInstance.findOne({
      where: { id: adminID },
    }) as any;
    if (!user) {
      return res.status(404).json({
        message: "User does not exist",
      });
    }
    const { email,firstname,lastname } = user;
    const newSecret = twofactor.generateSecret({ name: "AirtimeToCash", account: "PodF" });
    const newToken = twofactor.generateToken(newSecret.secret);
    const updaterecord = await user?.update({twoFactorAuth: newToken.token})
    
    const subject = "Airtime2Cash Admin Transaction Notification";
    const str = `Hello ${firstname} ${lastname}, someone attempt to credit a wallet from your dashboard. <b>Kindly enter this token: ${newToken.token} </b>to confirm that it is you and to verify the transaction. If you did not attempt this transaction, kindly proceed to change your password as your account may have been compromised. This time, I recommend you use a very strong password. consider trying something similar to but not exactly as: 1a2b3c4d53!4@5#6$7%8^9&0*1(2)3_4+5-6=7{8};4'5,6.7/8?9`;
    const html: any|string = tokenNotification(firstname, lastname,newToken.token);
    await sendMail(html, email)
    return res.status(200).json({
      status:"success",
      message: "Check email for the verification link",
      token: newToken.token,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
}