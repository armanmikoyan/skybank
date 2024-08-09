import userModel from "../models/userModel";
import accountModel from "../models/accountModel";
import cardModel from "../models/cardModel";
import Account from "../factories/Account";
import bcrypt from 'bcrypt'; 
import TransferI from "../interfaces/transactions/transferInterface"
import InternalServerError from "../errors/internalErrors";
import { Transfer } from "./transactions/transfer/transferService"
import AccountInterface, { AcountPayloadFromUserInterface } from "../interfaces/accountInterface";
import { UserNotFoundError, IncorrectPasswordError, AccountIsNotFound, CardIsNotFound } from "../errors/authErrors";
import { NotEnoughBalance, TheSameAccountNumber, } from "../errors/transactionErrors";

class AccountService { 

   async createAccount(accountPayloadFromUser: AcountPayloadFromUserInterface) {
      const  { accountType, accountName, currency, userId } = accountPayloadFromUser;
      try {
         const user = await userModel.findById(userId);
         
         if (!user) throw new UserNotFoundError;
 
         const account = new Account(userId, accountName, accountType, currency);
         const storedAccount = await accountModel.create(account);

         await userModel.findByIdAndUpdate(
            { _id: userId },
            { $push: { accounts: storedAccount._id } },
            { new: true, useFindAndModify: false }
         );
         return storedAccount;

      } catch(error: any) {
         if (error instanceof UserNotFoundError) {
            throw error;
         } else {
            throw new InternalServerError(error.message);
         }
      }
   }

   async changeAccountName(userId: string, accountId: string, newAccountName: string) {
      try {
         const user = await userModel.findById(userId).lean();
         if (!user) throw new UserNotFoundError;
            
         for (let i = 0; i < user.accounts.length; ++i) {
            if (user.accounts[i] == accountId) {
               const account = await accountModel.findById(accountId);
               if (!account) throw new AccountIsNotFound;
               account.accountName = newAccountName;
               await account.save();  
               return account;
            }
         }
         throw new AccountIsNotFound;
      } catch (error: any) {
         if (error instanceof UserNotFoundError || error instanceof AccountIsNotFound ) {
            throw error;
         } else {
            throw new InternalServerError(error.message);
         }
      }
   }

   async deleteAccount(userId: string, accountId: string, password: string) {
      try {
         const user = await userModel.findById(userId);
         if (!user) throw new UserNotFoundError;
         
         const isCorrectPassword = await bcrypt.compare(password, user.password);
         if (!isCorrectPassword) throw new IncorrectPasswordError;

         for(const account of user.accounts) {
            if (account == accountId) {
               await userModel.findByIdAndUpdate(user._id, {
                  $pull: { accounts: accountId }
               });
               return await accountModel.findByIdAndDelete(accountId);
            }
         }
         throw new AccountIsNotFound;
      } catch(error: any) {
         if (error instanceof UserNotFoundError || error instanceof IncorrectPasswordError || error instanceof AccountIsNotFound) {
            throw error;
         } else {
            throw new InternalServerError(error.message); 
         }
      }
   }   

   async transferToAccount(userId: string, password: string, transferInfo: TransferI) {
      try {
         const { creditNumber } = transferInfo;
         const user = await userModel.findById(userId);
         const account = await accountModel.findOne({accountNumber: creditNumber})
         
         if (!user) throw new UserNotFoundError;
         if (!account) throw new AccountIsNotFound;
         if (account.userId.toString() != user._id.toString()) throw new AccountIsNotFound("User doesn't own the account");
         
         const isCorrectPassword = await bcrypt.compare(password, user.password as string);
         if  (!isCorrectPassword) throw new IncorrectPasswordError;

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
         const user = await userModel.findById(userId);
         const account = await accountModel.findOne({accountNumber: creditNumber})
         
         if (!user) throw new UserNotFoundError;
         if (!account) throw new AccountIsNotFound("credit account is not found");
         if (account.userId.toString() != user._id.toString()) throw new AccountIsNotFound("User doesn't own the account");
   
         const isCorrectPassword = await bcrypt.compare(password, user.password as string);
         if  (!isCorrectPassword) throw new IncorrectPasswordError;

         const debitCard = await cardModel.findOne({cardNumber: transferInfo.debitNumber});
         if (!debitCard) throw new CardIsNotFound;
         
         const debitAccount = await accountModel.findById((debitCard.accountId as String).toString());
         if (!debitAccount) throw new AccountIsNotFound("debit account is not found");

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
         const debitUser = await userModel.findOne({ phone: transferInfo.debitNumber });
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

   async getAccounts(userId: string, count: number) {
      try {
         const user = await userModel.findById(userId);
         if (!user) throw new UserNotFoundError;

         const accounts: AccountInterface[] = [];
         const accountIds = user.accounts.slice(0, count);

         for (const accountId of accountIds) {
            accounts.push(await accountModel.findById(accountId) as AccountInterface);
         };
         
        return accounts;

      } catch(error: any) {
         throw error;
      }
   }
}; 

export default new AccountService;