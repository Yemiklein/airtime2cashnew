import express, { Request, Response, NextFunction } from 'express';
import { userInstance } from '../model/userModel';
import { CreditInstance } from '../model/credit';
import { creditSchema, options } from '../utils/utils';
import { v4 as uuidv4 } from 'uuid';

export async function credit(req: Request | any, res: Response, next: NextFunction) {
    const id = uuidv4()
    try {
        
            const userID = req.user.id;
            const { email, amount} = req.body;
            const validatedInput = await creditSchema.validateAsync(req.body, options);
          if (validatedInput.error) {
            return res.status(400).json(validatedInput.error.details[0].message);
          }
          const customer = await userInstance.findOne({where: {email}})
          if(!customer){
              return res.status(404).json({message:"customer not found"})
          }

          const Admin:any = await userInstance.findOne({where:{id:userID}});

          const adminWallet = Admin.walletBalance;

          if(adminWallet < amount){
              return res.status(404).json({
                  message:'insufficient fund'
              })
          }
          const newCustomerWalletBalance = customer.walletBalance + amount;
          const newAdminWalletBalance = adminWallet - amount;
          
          const creditedCustomer = await userInstance.update({walletBalance:newCustomerWalletBalance}, {where:{email}});
          
          const updatedAdmin = await userInstance.update({walletBalance:newAdminWalletBalance}, {where:{id:userID}});
          
      
          const creditRecord = await CreditInstance.create({id:id, email, userId: userID, amount });
          return res.status(201).json({
              message:`You have successful credited ${email} with the sum of ${amount}`, creditRecord
          });
          
    } catch (error) {
        return res.status(500).json({
            message:"fail to credit cutomer wallet"
        })
    }
}