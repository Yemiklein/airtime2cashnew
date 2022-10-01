import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { withdrawSchema, options } from '../utils/utils';
import { WithdrawHistoryInstance } from '../model/withdrawalHistory';
import { AccountInstance } from '../model/accounts';
import { userInstance } from '../model/userModel';

export const withdraw = async (req: Request | any, res: Response, next: NextFunction) => {
  const id = uuidv4();

  try {
    //   get user id from validated token and use it to get user account
    const userId = req.user.id;

    const { amount, accountNumber, bankName } = req.body;
    const validatedInput = await withdrawSchema.validateAsync(req.body, options);
    if (validatedInput.error) {
      return res.status(400).json(validatedInput.error.details[0].message);
    }

    const user = await userInstance.findOne({ where: { id: userId } });
    // console.log(user); // les see validated we have here
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // get destination account here where we are sending money to
    const account = await AccountInstance.findOne({ where: { accountNumber } });
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }
    // check if user has enough money to withdraw from wallet
    const currentWalletBalance = user.walletBalance;
    if (currentWalletBalance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    //  withdraw from user wallet aallow payment gateway to come in here
    //  withdraw from user wallet and update user wallet balance
    const newBalance = currentWalletBalance - amount;
    const withdraw = await userInstance.update({ walletBalance: newBalance }, { where: { id: userId } });
    const transaction = await WithdrawHistoryInstance.create({
      id: id,
      userId: userId,
      amount: amount,
      accountNumber: accountNumber,
      bankName: bankName,
      status: true,
    });
    return res.status(200).json({ message: 'Withdraw successful', withdraw, transaction });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error,
    });
  }
};
