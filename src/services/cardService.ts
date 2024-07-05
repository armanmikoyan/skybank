import cardSchema from "../models/cardModel"
import userSchema from "../models/userModel";
import Card from "../class/Card"
import bcrypt from 'bcrypt';
import InternalServerError from "../errors/internalErrors"
import accountModel from "../models/accountModel";
import { CardPayloadFromUserInterface } from "../interfaces/cardInterface"
import { CardIsNotFound, UserNotFoundError, IncorrectPin } from "../errors/authErrors";
import { AccountIsNotFound, AccountIsBusy } from "../errors/authErrors";

class CardService {

   async createCard(cardPayloadFromUser: CardPayloadFromUserInterface) {
      const { userId, accountId, cardHolderName, pin, cardType, cardName, currency } = cardPayloadFromUser;   
      try {
         const user = await userSchema.findById(userId);
         if (!user) throw UserNotFoundError;   

         const account = await accountModel.findById(accountId);
         if (!account) throw new AccountIsNotFound;

         const userHasAccount = user.accounts.includes(accountId);
         if (!userHasAccount) throw new AccountIsNotFound;

         if (account.hasCard) throw new AccountIsBusy; 

         const hashedPin = await bcrypt.hash(pin, 10);
         const card = new Card(userId, accountId, cardHolderName, hashedPin, cardType, cardName, currency);  
         card.cvv = await bcrypt.hash(card.cvv, 10);
         const storedCard = await cardSchema.create(card);
   
         await userSchema.findByIdAndUpdate( 
            userId,
            { $push: { cards: storedCard._id } },
            { new: true, useFindAndModify: false });


         account.hasCard = true;
         await account.save();
         return storedCard;

      } catch (error: any) {
         if (error instanceof UserNotFoundError || error instanceof AccountIsBusy || error instanceof AccountIsNotFound) {
            throw error;
         } else {
            throw new InternalServerError(error.message);
         }
      }    
   }; 

   async changeCardName(userId: string, cardId: string, newCardName: string, pin: string) {
      try {
         const user = await userSchema.findById(userId).lean();
         if (!user) throw new UserNotFoundError;
    
         for (let i = 0; i < user.cards.length; ++i) {
            if (user.cards[i] == cardId) {
               const card = await cardSchema.findById(cardId);
               if (!card) throw new CardIsNotFound;

               const isCorrectPin = await bcrypt.compare(pin, card.pin as string);
               if (!isCorrectPin) throw new IncorrectPin;

               card.cardName = newCardName;
               return await card.save();  
            }
         }
         throw new CardIsNotFound;
      } catch(error: any) {
         if (error instanceof UserNotFoundError || error instanceof CardIsNotFound || error instanceof IncorrectPin) {
            throw error;
         } else {
            throw new InternalServerError(error.message);
         }
      }
   };

   async deleteCard(userId: string, cardId: string, pin: string) {
      try {
         const user = await userSchema.findById(userId).lean();
         if (!user) throw new UserNotFoundError;
         
         for (let i = 0; i < user.cards.length; ++i) {
            if (user.cards[i] == cardId) {
               const card = await cardSchema.findById(cardId);
               if (!card) throw new CardIsNotFound;

               const isCorrectPin = await bcrypt.compare(pin, card.pin as string);
               if (!isCorrectPin) throw new IncorrectPin;

               await accountModel.findByIdAndUpdate(card.accountId, { hasCard: false });
               await cardSchema.findByIdAndDelete(cardId);
               return await userSchema.findByIdAndUpdate(
                  { _id: card.userId },
                  { $pull: { cards: cardId } }
               );            
            }
         }
         throw new CardIsNotFound;
      } catch(error: any) {
         if (error instanceof UserNotFoundError || error instanceof CardIsNotFound || error instanceof IncorrectPin) {
            throw error;
         } else {
            throw new InternalServerError(error.message);
         }
      }
   };
};

export default new CardService;