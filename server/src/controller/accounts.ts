import express, { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4, validate } from 'uuid';
import { createAccountSchema, withdrawSchema, options } from '../utils/utils';
import { WithdrawHistoryInstance } from '../model/withdrawalHistory';
import { AccountInstance } from '../model/accounts';
import { userInstance } from '../model/userModel';

export async function CreateAccount(req: Request | any, res: Response, next: NextFunction) {
  const id = uuidv4();
  try {
    const userID = req.user.id;
    const ValidateAccount = await createAccountSchema.validateAsync(req.body, options);
    if (ValidateAccount.error) {
      return res.status(400).json({
        status: 'error',
        message: ValidateAccount.error.details[0].message,
      });
    }
    const duplicateAccount = await AccountInstance.findOne({
      where: { accountNumber: req.body.accountNumber },
    });
    if (duplicateAccount) {
      return res.status(409).json({
        message: 'Account number is used, please enter another account number',
      });
    }

    const record = await AccountInstance.create({
      id: id,
      bankName: req.body.bankName,
      accountNumber: req.body.accountNumber,
      accountName: req.body.accountName,
      userId: userID,
      // walletBalance: req.body.walletBalance,
    });

    if (record) {
      return res.status(201).json({
        status: 'success',
        message: 'Account created successfully',
        data: record,
      });
    }
  } catch (error: any) {
    return res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
}

export async function getBankAccounts(req: Request | any, res: Response, next: NextFunction) {
  try {
    console.log('here');
    const userID = req.user.id;
    const account = await AccountInstance.findAll({
      where: { userId: userID },
    });
    if (account) {
      return res.status(200).json({
        status: 'success',
        message: 'Account retrieved successfully',
        data: account,
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'internal server error',
    });
  }
}

export async function deleteBankAccount(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id;
    const account = await AccountInstance.findOne({
      where: { id: id },
    });
    if (account) {
      await account.destroy();
      return res.status(200).json({
        status: 'success',
        message: 'Account deleted successfully',
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'internal server error',
    });
  }
}

export async function getUserAccount(req: Request | any, res: Response, next: NextFunction) {
  try {
    const userID = req.user.id;
    const account = await AccountInstance.findOne({
      where: { userId: userID },
    });
    if (account) {
      return res.status(200).json({
        status: 'success',
        message: 'Account retrieved successfully',
        data: account,
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'internal server error',
    });
  }
}

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
    })
    return res.status(200).json({ message: 'Withdraw successful', withdraw, transaction });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error,
    });
  }
};
