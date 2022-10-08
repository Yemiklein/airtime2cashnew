import express, { Request, Response, NextFunction } from 'express';
import { userInstance } from '../model/userModel';
import { creditSchema, options } from '../utils/utils';
import { v4 as uuidv4 } from 'uuid';
import { SellAirtimeInstance } from '../model/sellAirtimeModel';

export async function credit(req: Request | any, res: Response, next: NextFunction) {
    const id = uuidv4()
    try {
            // const userID = req.user.id; 
            const { email, amountToSend, status, transactionID} = req.body;

            // JOY VALIDATION
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
            transactionStatus:status},{where:{id:transactionID}
          })

          if(status === 'sent'){
          const creditedCustomer = await userInstance.update({walletBalance:newCustomerWalletBalance}, {where:{email}});
       
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
            message:"fail to credit cutomer wallet"
        })
    }
}