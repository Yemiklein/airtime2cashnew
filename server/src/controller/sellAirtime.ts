import express, { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4, validate } from 'uuid';
import { AccountInstance } from '../model/accounts';
import { SellAirtimeInstance } from '../model/sellAirtimeModel';
import { userInstance } from '../model/userModel';
import { createAccountSchema, options, postAirTimeSchema } from '../utils/utils';

const adminNumbers = ['08030008610', '08054240322', '09089876789', '08025678909'];
const network = ['MTN', 'GLO', '9MOBILE', 'AIRTEL'];

export async function postSellAirtime(req: Request | any, res: Response, next: NextFunction) {
  const id = uuidv4();
  try {
    const { network, phoneNumber, amountToSell, sharePin } = req.body;
    const userID = req.user.id;

    const validateSellAirtime = await postAirTimeSchema.validate(req.body, options);
    if (validateSellAirtime.error) {
      return res.status(400).json(validateSellAirtime.error.details[0].message);
    }
    const validUser = await userInstance.findOne({ where: { id: userID } });
    if (!validUser) {
      return res.status(401).json({ message: 'Sorry user does not exist' });
    }
    const amountToReceive = 0.7 * amountToSell;
    let destinationPhoneNumber;

    let USSD;
    switch (network) {
      case 'MTN':
        destinationPhoneNumber = adminNumbers[0];
        USSD = `*600*${destinationPhoneNumber}*${amountToSell}*${sharePin}#`;

        break;

      case 'GLO':
        destinationPhoneNumber = adminNumbers[1];
        USSD = `*131*${destinationPhoneNumber}*${amountToSell}*${sharePin}#`;
        break;

      case '9MOBILE':
        destinationPhoneNumber = adminNumbers[2];
        USSD = `*223*${sharePin}*${amountToSell}*${destinationPhoneNumber}#`;
        break;

      case 'AIRTEL':
        destinationPhoneNumber = adminNumbers[3];
        USSD = `*432*${destinationPhoneNumber}*${amountToSell}*${sharePin}#`;
        break;

      default:
        res.status(400).json({ message: 'Please select a Network' });
        break;
    }

    // res
    //   .status(201)
    //   .json({ network, phoneNumber, amountToSell, sharePin, destinationPhoneNumber, USSD, amountToReceive });
    const transactions = await SellAirtimeInstance.create({
      id: id,
      phoneNumber,
      network,
      amountToSell,
      userID,
    });

    if (!transactions) {
      res.status(404).json({ message: 'Sorry, transaction was not successful' });
    }
    return res.status(201).json(transactions);
  } catch (error: any) {
    console.log(error);
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
    let size = 10;
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
    return res.send ({
      content: transactions.rows,
      totalPages: Math.ceil(transactions.count / size),
    })
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error,
    });
  }
}