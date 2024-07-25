import cardService from "../services/cardService"
import InternalServerError from "../errors/internalErrors"
import TransferI from "../interfaces/transactions/transferInterface"
import accountsService from "../services/accountsService";
import { Request, Response } from "express";
import CardInterface, { CardPayloadFromUserInterface } from "../interfaces/cardInterface"
import { AcountPayloadFromUserInterface } from "../interfaces/accountInterface"
import { CardIsNotFound, UserNotFoundError, IncorrectPin, AccountIsNotFound, AccountIsBusy, IncorrectPasswordError } from "../errors/authErrors";
import { TheSameAccountNumber, NotEnoughBalance } from "../errors/transactionErrors"
import { AccountType } from "../interfaces/accountInterface"
import { Currency } from "../interfaces/transactions/transactionInterface";

class CardController { 

   async createCard(req: Request, res: Response) { 
      try {
         let { pin, cardType, cardName, accountId } = req.body;
        
         if (!accountId) {
            const defaultAccount: AcountPayloadFromUserInterface = {
               accountType: AccountType.Current, 
               currency: Currency.AMD, 
               userId: req.body.authorizedUser.id,
               accountName: ""
            }
            accountId = (await accountsService.createAccount(defaultAccount))._id;
         }

         const cardInfo: CardPayloadFromUserInterface = {
            pin,
            cardType,
            cardName,
            accountId,
            cardHolderName: req.body.authorizedUser.firstName + " " + req.body.authorizedUser.lastName,
            userId: req.body.authorizedUser.id,
         };
         const card = await cardService.createCard(cardInfo);
         res.status(201).json({ message: "Card created successfully", card });
      } catch(error: any) {
         if (error instanceof UserNotFoundError || error instanceof AccountIsNotFound) {
            res.status(404).json({ error: error.message });
         } else if(error instanceof AccountIsBusy) {
            res.status(409).json({ error: error.message });
         } else if (error instanceof InternalServerError) {
            res.status(500).json({ error: error.message });
         } else {
            res.status(501).json({ error: error.message });
         }
      }
   }; 
    
   async changeCardName(req: Request, res: Response) {
      const { authorizedUser: { id: userId }, pin } = req.body;
      const { id: cardId } = req.params;
      const { newCardName } = req.query;
      try {
         await cardService.changeCardName(userId, cardId, newCardName as string, pin);
         res.status(201).json({ message: "Card name changed successfully" });
      } catch(error: any) {
         if (error instanceof UserNotFoundError || error instanceof CardIsNotFound) {
            res.status(404).json({ error: error.message });
         } else if (error instanceof IncorrectPin) {
            res.status(409).json({ error: error.message });
         } else if (error instanceof InternalServerError) {
            res.status(500).json({ error: error.message });
         } else {
            res.status(501).json({ error: error.message });
         }
      }  
   };

   async deleteCard(req: Request, res: Response) {
      const { authorizedUser: { id: userId }, pin } = req.body;
      const { id: cardId } = req.params;
      try {
         await cardService.deleteCard(userId, cardId, pin);
         res.status(201).json({ message: "Card deleted successfully" });
      } catch(error: any) {
         if (error instanceof UserNotFoundError || error instanceof CardIsNotFound) {
            res.status(404).json({ error: error.message });
         } else if (error instanceof IncorrectPin) {
            res.status(409).json({ error: error.message });
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
         await cardService.transferToAccount(userId, password, transferInfo);
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

   async transferToCard(req: Request, res: Response) {
      const { creditNumber, debitNumber, password, amount, notes, authorizedUser: { id: userId } } = req.body;
      const transferInfo: TransferI = {
         creditNumber, 
         debitNumber, 
         creditAmount: amount, 
         notes
      }
      try {
         await cardService.transferToCard(userId, password, transferInfo);
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
         await cardService.proxyServiceViaPhone(userId, password, transferInfo);
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

   async getCards(req: Request, res: Response) {
      const defaultAccountCount: number = Infinity;
      const { authorizedUser: { id } } = req.body;
      const countQuery = Number(req.query.count as string);
      const count = (isNaN(countQuery) || countQuery <= 0) ? defaultAccountCount : countQuery;

      try {
         const cards: CardInterface[] = await cardService.getCards(id, count);
         res.status(200).json(cards);
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

export default new CardController;
