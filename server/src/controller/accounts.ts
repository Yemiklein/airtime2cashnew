import express, { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4, validate } from 'uuid';
import { AccountInstance } from '../model/accounts';
import { createAccountSchema, options } from '../utils/utils';

export async function CreateAccount(
    req: Request,
    res: Response,
    next: NextFunction
    ) {
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
         })
         if ( duplicateAccount) {
            return res.status(409).json({
                msg: "Account number is used, please enter another account number",
                });
        }

        const record = await AccountInstance.create({
            id: id,
            bankName: req.body.bankName,
            accountNumber: req.body.accountNumber,
            accountName: req.body.accountName,
            userId: userID,
            walletBalance: req.body.walletBalance,
        })

        if (record) {
            return res.status(201).json({
                status: 'success',
                message: 'Account created successfully',
                data: record,
            });
        }
    }catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'internal server error',
        });
    }
}

export async function getBankAccounts(req: Request|any, res: Response, next: NextFunction) {
    try {
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


