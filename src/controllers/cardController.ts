import cardService from "../services/cardService"
import InternalServerError from "../errors/internalErrors"
import { Request, Response } from "express";
import { CardPayloadFromUserInterface } from "../interfaces/cardInterface"
import { CardIsNotFound, UserNotFoundError, IncorrectPin, AccountIsNotFound, AccountIsBusy } from "../errors/authErrors";

class CardController {

   async createCard(req: Request, res: Response) { 
      try {
         const { pin, cardType, cardName, currency, accountId } = req.body;
         const cardInfo: CardPayloadFromUserInterface = {
            pin,
            cardType,
            cardName,
            currency,
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
   };
};

export default new CardController;
