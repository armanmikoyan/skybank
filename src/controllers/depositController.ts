import InternalServerError from "../errors/internalErrors"
import depositService from "../services/depositService";
import { Request, Response } from "express";
import { AccountIsNotFound, UserNotFoundError } from "../errors/authErrors";
import { DepositI, allDepositTypes } from "../interfaces/depositInterface";

class DepositController { 
   async deposit(req: Request, res: Response) { 
      const { authorizedUser: { id: userId }, accountId,  amount, currency } = req.body;
      const type: allDepositTypes = req.params.type as allDepositTypes

      try {
         await depositService.deposit(userId, accountId, type, amount, currency);
         res.status(200).json({ message: "Deposit was done"});
      } catch(error: any) {
         if (error instanceof UserNotFoundError || error instanceof AccountIsNotFound) {
            res.status(404).json({ error: error.message })
         } else if (error instanceof InternalServerError) {
            res.status(500).json({ error: error.message });
         } else {
            res.status(501).json({ error: error.message });
         }
      }
   }

   async getAllDeposits(req: Request, res: Response) {
      const defaultDepositCount: number = Infinity;

      const { authorizedUser: { id: userId } } = req.body;
      const countQuery = Number(req.query.count as string);
      const count = (isNaN(countQuery) || countQuery <= 0) ? defaultDepositCount : countQuery;
      try {
         const deposits: DepositI[] = await depositService.getDeposits(userId, count);
         res.status(200).json(deposits);
      } catch (error: any) {
         if (error instanceof UserNotFoundError) {
            res.status(404).json({ error: error.message })
         } else if (error instanceof InternalServerError) {
            res.status(500).json({ error: error.message });
         } else {
            res.status(501).json({ error: error.message });
         }
      }
   }
};

export default new DepositController;
