import cardSchema from "../models/cardModel"
import userSchema from "../models/userModel";
import Card from "../factories/Card"
import bcrypt from 'bcrypt';
import InternalServerError from "../errors/internalErrors"
import accountModel from "../models/accountModel";
import cardModel from "../models/cardModel";
import TransferI from "../interfaces/transactions/transferInterface"
import { Transfer } from "./transactions/transfer/transferService"
import CardInterface, { CardPayloadFromUserInterface } from "../interfaces/cardInterface"
import { CardIsNotFound, UserNotFoundError, IncorrectPin, IncorrectPasswordError } from "../errors/authErrors";
import { AccountIsNotFound, AccountIsBusy } from "../errors/authErrors";
import { NotEnoughBalance, TheSameAccountNumber, } from "../errors/transactionErrors";
import { Currency } from "../interfaces/transactions/transactionInterface"
import { transporter } from "../utils/transportEmail"


 
class CardService {

   async createCard(cardPayloadFromUser: CardPayloadFromUserInterface) {
      const { userId, accountId, cardHolderName, cardType, cardName } = cardPayloadFromUser;   
      try {
         const user = await userSchema.findById(userId);
         if (!user) throw UserNotFoundError;   

         const account = await accountModel.findById(accountId);
         if (!account) throw new AccountIsNotFound;

         const userHasAccount = user.accounts.includes(accountId);
         if (!userHasAccount) throw new AccountIsNotFound;

         if (account.hasCard) throw new AccountIsBusy; 

         const currency: Currency = account.currency as Currency;
         const card = new Card(userId, accountId, cardHolderName, cardType, cardName, currency);  
         card.balance = account.balance;

         await this.sendPin(user.email, card.pin);
         card.pin = await bcrypt.hash(card.pin, 10);
         card.cvv = await bcrypt.hash(card.cvv, 10);
         const storedCard = await cardSchema.create(card);
   
         await userSchema.findByIdAndUpdate( 
            userId,
            { $push: { cards: storedCard._id } },
            { new: true, useFindAndModify: false 
         });
         
         account.hasCard = true;
         account.cardId = (storedCard._id as any).toString();
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

   async changeCardName(userId: string, cardId: string, newCardName: string) {
      try {
         const user = await userSchema.findById(userId).lean();
         if (!user) throw new UserNotFoundError;
    
         for (let i = 0; i < user.cards.length; ++i) {
            if (user.cards[i] == cardId) {
               const card = await cardSchema.findById(cardId);
               if (!card) throw new CardIsNotFound;

               card.cardName = newCardName;
               await card.save();  
               return card;
            }
         }
         throw new CardIsNotFound;
      } catch(error: any) {
         if (error instanceof UserNotFoundError || error instanceof CardIsNotFound) {
            throw error;
         } else {
            throw new InternalServerError(error.message);
         }
      }
   };

   async changePin(userId: string, cardId: string, oldPin: string, newPin: string) {
      try {
         const user = await userSchema.findById(userId).lean();
         if (!user) throw new UserNotFoundError;
    
         for (let i = 0; i < user.cards.length; ++i) {
            if (user.cards[i] == cardId) {
               const card = await cardSchema.findById(cardId);
               if (!card) throw new CardIsNotFound;

               const isCorrectPin = await bcrypt.compare(oldPin, card.pin as string);
               if (!isCorrectPin) throw new IncorrectPin;
               const hashedPin = await bcrypt.hash(newPin, 10);
               card.pin = hashedPin;
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

               await accountModel.findByIdAndUpdate(card.accountId, { hasCard: false, cardId: "" });
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
   }

   async transferToAccount(userId: string, password: string, transferInfo: TransferI) {
      try {
         const { creditNumber } = transferInfo;
         const user = await userSchema.findById(userId);
         const creditCard = await cardModel.findOne({cardNumber: creditNumber})
         
         if (!user) throw new UserNotFoundError;
         if (!creditCard) throw new CardIsNotFound;
         if ((creditCard.userId as string).toString() != user._id.toString()) throw new AccountIsNotFound("User doesn't own the Card");
         
         const isCorrectPassword = await bcrypt.compare(password, user.password as string);
         if  (!isCorrectPassword) throw new IncorrectPasswordError;
   
         const creditAccount = await accountModel.findById((creditCard.accountId as String).toString());
         if (!creditAccount) throw new AccountIsNotFound;

         transferInfo.creditNumber = creditAccount.accountNumber;

         const transferMaker = new Transfer(transferInfo);
         await transferMaker.makeTransaction();
   
      } catch (error: any) {
         if (error instanceof UserNotFoundError || error instanceof AccountIsNotFound || error instanceof IncorrectPasswordError || error instanceof TheSameAccountNumber || error instanceof NotEnoughBalance || error instanceof CardIsNotFound) {
            throw error;
         }
         throw new InternalServerError(error.message);
      }
   }

   async transferToCard(userId: string, password: string, transferInfo: TransferI) {
      try {
         const { creditNumber } = transferInfo;
         const user = await userSchema.findById(userId);
         const creditCard = await cardModel.findOne({cardNumber: creditNumber})
         
         if (!user) throw new UserNotFoundError;
         if (!creditCard) throw new CardIsNotFound;
         if ((creditCard.userId as string).toString() != user._id.toString()) throw new AccountIsNotFound("User doesn't own the Card");
   
         const isCorrectPassword = await bcrypt.compare(password, user.password as string);
         if  (!isCorrectPassword) throw new IncorrectPasswordError;
        
         const creditAccount = await accountModel.findById((creditCard.accountId as String).toString());
         if (!creditAccount) throw new AccountIsNotFound;

         transferInfo.creditNumber = creditAccount.accountNumber;

         const debitCard = await cardSchema.findOne({cardNumber: transferInfo.debitNumber});
         if (!debitCard) throw new CardIsNotFound;
         
         const debitAccount = await accountModel.findById((debitCard.accountId as String).toString());
         if (!debitAccount) throw new AccountIsNotFound;

         transferInfo.debitNumber = debitAccount.accountNumber;

         const transferMaker = new Transfer(transferInfo);
         await transferMaker.makeTransaction();
   
      } catch (error: any) {
         if (error instanceof CardIsNotFound || error instanceof UserNotFoundError || error instanceof AccountIsNotFound || error instanceof IncorrectPasswordError || error instanceof TheSameAccountNumber || error instanceof NotEnoughBalance) {
            throw error;
         }
         throw new InternalServerError(error.message);
      }
   }

   async proxyServiceViaPhone(userId: string, password: string, transferInfo: TransferI) {
      try {
         const debitUser = await userSchema.findOne({ phone: transferInfo.debitNumber });
         if (!debitUser) throw new UserNotFoundError("Debit user is not found");
         const account = await accountModel.findById(debitUser.accounts[0]);
         if (!account) throw new AccountIsNotFound("debit user doesn't have any account");
         transferInfo.debitNumber = account.accountNumber as string;
         await this.transferToAccount(userId, password, transferInfo);
      } catch(error: any) {
         if (error instanceof UserNotFoundError || error instanceof AccountIsNotFound || error instanceof IncorrectPasswordError || error instanceof TheSameAccountNumber || error instanceof NotEnoughBalance) {
            throw error;
         }
         throw new InternalServerError(error.message);
      }
   }


   async getCards(userId: string, count: number) {
      try {
         const user = await userSchema.findById(userId);
         if (!user) throw new UserNotFoundError;

         const cards: CardInterface[] = [];
         const cardIds = user.cards.slice(0, count);

         for (const cardId of cardIds) {
            cards.push(await cardModel.findById(cardId) as CardInterface);
         };
        return cards;
      } catch(error: any) {
         throw error;
      }
   }

   private async sendPin(who: string, code: string) {
      const htmlContent = `
      <a style="
          display: inline-block; 
          padding: 10px 20px; 
          margin: 10px 0; 
          font-size: 16px; 
          color: #ffffff; 
          background-color: #007bff; 
          text-decoration: none; 
          border-radius: 5px;
          border: 1px solid #007bff;
          transition: background-color 0.3s ease;
      " 
      href="#">
        ${code}
      </a>`;
    
      const mailOptions = {
         from: process.env.EMAIL_USER,
         to: who, 
         subject: "Your card pin",
         html: htmlContent,
      };
      transporter.sendMail(mailOptions);
   }
};

export default new CardService;