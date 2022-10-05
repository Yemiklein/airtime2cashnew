//import express, { Request, Response, NextFunction } from 'express';
//import { userInstance } from '../model/userModel';


//export const credit = async (req: Request | any, res: Response, next: NextFunction) => {
    //   const id = uuidv4();
    
    //   try {
    //    
    //     //   get user id from validated token with user wallet
    //     const userId = req.user.id;
        
    //     const { amount, email} = req.body;
    //     const validatedInput = await creditSchema.validateAsync(req.body, options);
    //     if (validatedInput.error) {
    //       return res.status(400).json(validatedInput.error.details[0].message);
    //     }
        
    //     const user = await userInstance.findOne({ where: { id: userId }||{id; email} });
    //     if (!user) {
    //       return res.status(404).json({ message: 'User not found' });
    //     }
           
    //   const wallet = await CreditInstance.findOne({ where: { walletBalance } });
    //     if (!wallet) {
    //       return res.status(404).json({ message: 'wallet not found' });
    //     }
    //   //updating the wallet
    //let 
    //   //   const updateWalletUser = currentBalance + amount;
    //const updateWalletAdim = accountBal - amount
      //   const credit= await userInstance.update({ walletBalance: updateWallet}, { where: { id: userId } });
      //   const wallet = await Wallet.findOne(
      //   
        // "userId":
        //  "email":
    //      "amount":
        //
    //   }
      //   );
      //   return res.status(200).json({ message: 'wallet funded successfully', wallet });
    //   }   catch (error) {
    //       return res.status(500).json({
    //         status: 'error',
    //         message: error,
    //         });
    //       }
    // };
     
      
    
    















// Update wallet 
//const updateWallet = async (userId, amount) => {
 // try {
    // update wallet
//     const wallet = await Wallet.findOneAndUpdate(
//       { userId },
//       { $inc: { balance: amount } },
//       { new: true }
//     );
//     return wallet;
//   } catch (error) {
//     console.log(error);
//   }
// };


// app.get("/response", async (req, res) => {
//     const { transaction_id } = req.query;
  
//     // URL with transaction ID of which will be used to confirm transaction status
//     const url = `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`;
  
//     // Network call to confirm transaction status
//     const response = await axios({
//       url,
//       method: "get",
//       headers: {
//         "Content-Type": "application/json",
//         Accept: "application/json",
//         Authorization: `${process.env.FLUTTERWAVE_V3_SECRET_KEY}`,
//       },
//     });
  
//     const { status, currency, id, amount, customer } = response.data.data;
  
//     // check if customer exist in our database
//     const user = await User.findOne({ email: customer.email });
  
//     // check if user have a wallet, else create wallet
//     const wallet = await validateUserWallet(user._id);
  
//     // create wallet transaction
//     await createWalletTransaction(user._id, status, currency, amount);
  
//     // create transaction
//     await createTransaction(user._id, id, status, currency, amount, customer);
  
//     await updateWallet(user._id, amount);
  
//     return res.status(200).json({
//       response: "wallet funded successfully",
//       data: wallet,
//     });
//   });

//   app.get("/wallet/:userId/balance", async (req, res) => {
//     try {
//       const { userId } = req.params;
  
//       const wallet = await Wallet.findOne({ userId });
//       // user
//       res.status(200).json(wallet.balance);
//     } catch (err) {
//       console.log(err);
//     }
//   });
  

// app.get("/response", async (req, res) => {
//     const { transaction_id } = req.query;
  
//     //...
  
//     const { status, currency, id, amount, customer } = response.data.data;
  
//     // check if transaction id already exist
//     const transactionExist = await Transaction.findOne({ transactionId: id });
  
//     if (transactionExist) {
//       return res.status(409).send("Transaction Already Exist");
//     }
  
//     //...
  
//     return res.status(200).json({
//       response: "wallet funded successfully",
//       data: wallet,
//     });
//   });
  
//