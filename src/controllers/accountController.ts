import accountsService from "../services/accountsService";
import InternalServerError from "../errors/internalErrors"
import { Request, Response } from "express";
import { AccountIsNotFound, UserNotFoundError, IncorrectPasswordError } from "../errors/authErrors";
import { AcountPayloadFromUserInterface } from "../interfaces/accountInterface"

class accountController {

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
      const { authorizedUser: { id: userId }, password } = req.body;
      const { id: accountId } = req.params;
      const { newAccountName } = req.query;
      try {
         await accountsService.changeAccountName(userId, accountId, password, newAccountName as string);
         res.status(201).json({ message: "Account name changed successfully" });
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
};

export default new accountController;