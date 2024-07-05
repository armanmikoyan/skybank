import userModel from "../models/userModel";
import accountModel from "../models/accountModel";
import Account from "../class/Account";
import bcrypt from 'bcrypt'; 
import InternalServerError from "../errors/internalErrors";
import { AcountPayloadFromUserInterface } from "../interfaces/accountInterface";
import { UserNotFoundError, IncorrectPasswordError, AccountIsNotFound } from "../errors/authErrors";


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

   async changeAccountName(userId: string, accountId: string, password: string, newAccountName: string) {
      try {
         const user = await userModel.findById(userId).lean();
         if (!user) throw new UserNotFoundError;
         
         const isCorrectPassword = await bcrypt.compare(password, user.password as string);
         if (!isCorrectPassword) throw new IncorrectPasswordError;
         
         for (let i = 0; i < user.accounts.length; ++i) {
            if (user.accounts[i] == accountId) {
               const account = await accountModel.findById(accountId);
               if (!account) throw new AccountIsNotFound;
               account.accountName = newAccountName;
               return await account.save();  
            }
         }
         throw new AccountIsNotFound;
      } catch (error: any) {
         if (error instanceof UserNotFoundError || error instanceof AccountIsNotFound || error instanceof IncorrectPasswordError) {
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
}; 

export default new AccountService;