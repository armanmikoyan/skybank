import accountsService from "../services/accountsService";
import InternalServerError from "../errors/internalErrors"
import TransferI  from "../interfaces/transactions/transferInterface"
import AccountInterface from "../interfaces/accountInterface"
import { Request, Response } from "express";
import { AccountIsNotFound, UserNotFoundError, IncorrectPasswordError, CardIsNotFound } from "../errors/authErrors";
import { AcountPayloadFromUserInterface } from "../interfaces/accountInterface"
import { NotEnoughBalance, TheSameAccountNumber, } from "../errors/transactionErrors";

class AccountController {

   async createAccount(req: Request, res: Response) {
      try {
         const { accountType, accountName, currency, authorizedUser: { id } } = req.body;
         const accountInfo: AcountPayloadFromUserInterface = {
            accountType,
            currency,
            userId: id,
            accountName,
         };   
         const account = await accountsService.createAccount(accountInfo);
         res.status(201).json({ message: "Account created successfully", account });
      } catch(error: any) {
         if (error instanceof UserNotFoundError) {
            res.status(404).json({ error: error.message });
         } else if (error instanceof InternalServerError) {
            res.status(500).json({ error: error.message });
         } else {
            res.status(501).json({ error: error.message });
         }
      }
   }

   async changeAccountName(req: Request, res: Response) {
      const { authorizedUser: { id: userId } } = req.body;
      const { id: accountId } = req.params;
      const { newAccountName } = req.query;
      try {
         const account = await accountsService.changeAccountName(userId, accountId, newAccountName as string);
         res.status(201).json(account);
      } catch(error: any) {
         if (error instanceof UserNotFoundError || error instanceof AccountIsNotFound) {
            res.status(404).json({ error: error.message });
         } else if (error instanceof IncorrectPasswordError) {
            res.status(409).json({ error: error.message }); 
         } else if (error instanceof InternalServerError) {
            res.status(500).json({ error: error.message });
         } else {
            res.status(501).json({ error: error.message });
         }
      }
   }

   async deleteAccount(req: Request, res: Response) {
      try {
         const { id: accountId } = req.params; 
         const { password, authorizedUser: { id: userId } } = req.body;
         await accountsService.deleteAccount(userId, accountId, password);
         res.status(201).json({ message: "Account deleted successfully" });
      } catch(error: any) {
         if (error instanceof UserNotFoundError || error instanceof AccountIsNotFound) {
            res.status(404).json({ error: error.message });
         } else if (error instanceof IncorrectPasswordError) {
            res.status(401).json({ error: error.message });
         } else if (error instanceof InternalServerError) {
            res.status(500).json({ error: error.message });
         } else {
            res.status(501).json({ error: error.message });
         }
      }
   }

   async transferToAccount(req: Request, res: Response) {
      const { creditNumber, debitNumber, password, amount, notes, authorizedUser: { id: userId } } = req.body;
      const transferInfo: TransferI = {
         creditNumber, 
         debitNumber, 
         creditAmount: amount, 
         notes
      }
      try {
         await accountsService.transferToAccount(userId, password, transferInfo);
         res.status(200).json({ message: "Transaction completed successfully" });
      } catch (error: any) {
         if (error instanceof UserNotFoundError || error instanceof AccountIsNotFound) {
            res.status(404).json({ error: error.message });
         } else if (error instanceof IncorrectPasswordError) {
            res.status(401).json({ error: error.message });
         } else if (error instanceof TheSameAccountNumber) {
            res.status(409).json({ error: error.message });
         } else if (error instanceof NotEnoughBalance) {
            res.status(400).json({ error: error.message });
         } else if (error instanceof InternalServerError) {
            res.status(500).json({ error: error.message });
         } else {
            res.status(501).json({ error: error.message });
         }
      }
   }

   async transferToCard(req: Request, res: Response) {
      const { creditNumber, debitNumber, password, amount, notes, authorizedUser: { id: userId } } = req.body;
      const transferInfo: TransferI = {
         creditNumber, 
         debitNumber, 
         creditAmount: amount, 
         notes
      }
      try {
         await accountsService.transferToCard(userId, password, transferInfo);
         res.status(200).json({ message: "Transaction completed successfully" });
      } catch (error: any) {
         if (error instanceof UserNotFoundError || error instanceof AccountIsNotFound || error instanceof CardIsNotFound) {
            res.status(404).json({ error: error.message });
         } else if (error instanceof IncorrectPasswordError) {
            res.status(401).json({ error: error.message });
         } else if (error instanceof TheSameAccountNumber) {
            res.status(409).json({ error: error.message });
         } else if (error instanceof NotEnoughBalance) {
            res.status(400).json({ error: error.message });
         } else if (error instanceof InternalServerError) {
            res.status(500).json({ error: error.message });
         } else {
            res.status(501).json({ error: error.message });
         }
      }
   }

   async transferViaPhoneNumber(req: Request, res: Response) {
      const { creditNumber, debitNumber, password, amount, notes, authorizedUser: { id: userId } } = req.body;
      const transferInfo: TransferI = {
         creditNumber, 
         debitNumber, 
         creditAmount: amount, 
         notes 
      }
      try {
         await accountsService.proxyServiceViaPhone(userId, password, transferInfo);
         res.status(200).json({ message: "Transaction completed successfully" });
      } catch (error: any) {
         if (error instanceof UserNotFoundError || error instanceof AccountIsNotFound) {
            res.status(404).json({ error: error.message });
         } else if (error instanceof IncorrectPasswordError) {
            res.status(401).json({ error: error.message });
         } else if (error instanceof TheSameAccountNumber) {
            res.status(409).json({ error: error.message });
         } else if (error instanceof NotEnoughBalance) {
            res.status(400).json({ error: error.message });
         } else if (error instanceof InternalServerError) {
            res.status(500).json({ error: error.message });
         } else {
            res.status(501).json({ error: error.message });
         }
      }
   }

   async getAccounts(req: Request, res: Response) {
      const defaultAccountCount: number = Infinity;
      const { authorizedUser: { id } } = req.body;
      const countQuery = Number(req.query.count as string);
      const count = (isNaN(countQuery) || countQuery <= 0) ? defaultAccountCount : countQuery;

      try {
         const accounts: AccountInterface[] = await accountsService.getAccounts(id, count);
         res.status(200).json(accounts);
      } catch (error: any) {
         if (error instanceof UserNotFoundError) {
            res.status(404).json({ error: error.message });
         }  else if (error instanceof InternalServerError) {
            res.status(500).json({ error: error.message });
         } else {
            res.status(501).json({ error: error.message });
         }
      }   
   }

};

export default new AccountController;