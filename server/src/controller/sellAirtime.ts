import express, { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4, validate } from 'uuid';
import { AccountInstance } from '../model/accounts';
import { SellAirtimeInstance } from '../model/sellAirtimeModel';
import { userInstance } from '../model/userModel';
import { createAccountSchema, options, postAirTimeSchema } from '../utils/utils';

export async function postSellAirtime(req: Request | any, res: Response, next: NextFunction) {
  const id = uuidv4();
  try {
    const { network, phoneNumber, amountToSell, amountToReceive } = req.body;
    const userID = req.user.id;

    const validateSellAirtime = await postAirTimeSchema.validate(req.body, options);
    if (validateSellAirtime.error) {
      return res.status(400).json(validateSellAirtime.error.details[0].message);
    }
    const validUser = await userInstance.findOne({ where: { id: userID } });
    if (!validUser) {
      return res.status(401).json({ message: 'Sorry user does not exist' });
    }

    const transactions = await SellAirtimeInstance.create({
      id: id,
      phoneNumber,
      network,
      amountToSell,
      amountToReceive,
      userID,
    });

    if (!transactions) {
      res.status(404).json({ message: 'Sorry, transaction was not successful' });
    }

    return res.status(201).json(transactions);
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error });
  }
}

export async function allTransactions(req: Request | any, res: Response, next: NextFunction) {
  try {
    const pageAsNumber = Number.parseInt(req.query.page);
    const sizeAsNumber = Number.parseInt(req.query.size);
    let page = 0;
    if (!Number.isNaN(pageAsNumber) && pageAsNumber > 0) {
      page = pageAsNumber;
    }
    let size = 15;
    if (!Number.isNaN(sizeAsNumber) && sizeAsNumber > 0 && sizeAsNumber < 15) {
      size = sizeAsNumber;
    }
    const transactions = await SellAirtimeInstance.findAndCountAll({
      limit: size,
      offset: page * size,
    });
    if (!transactions) {
      return res.status(404).json({ message: 'No transaction found' });
    }
    return res.send({
      content: transactions.rows,
      totalPages: Math.ceil(transactions.count / size),
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error,
    });
  }
}
