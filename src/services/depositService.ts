import userModel from "../models/userModel";
import accountModel from "../models/accountModel";
import depositModel from "../models/depositModel";
import { AccountIsNotFound, UserNotFoundError } from "../errors/authErrors";
import { Currency } from "../interfaces/transactions/transactionInterface";
import { DepositI, allDepositTypes, depositRates } from "../interfaces/depositInterface";

class DepositService {
   async deposit(userId: string, accountId: string, type: allDepositTypes, amount: number, currency: Currency) {
      try {
         const user = await userModel.findById(userId);
         if (!user) throw new UserNotFoundError;
         const account = await accountModel.findById(accountId);
         if (!account) throw new AccountIsNotFound;

         if (!user.accounts.includes(accountId)) throw new AccountIsNotFound("User doesn't own the account");

         const deposit = new depositModel({
            userId,
            accountId,
            depositType: type,
            amount,
            currency,
          rate: depositRates[type],
         });

         user.deposits.push(deposit._id.toString());
         await deposit.save();
         await user.save();
      } catch(error: any) {
         throw error;
      }
   }

   async getDeposits(userId: string, count: number): Promise<DepositI[]> {
      try {
         const user = await userModel.findById(userId);
         if (!user) throw new UserNotFoundError;   

         const deposits: DepositI[] = []; 
         const depositIds = user.deposits.slice(0, count);

         for (const depositId of depositIds) {
            const deposit = await depositModel.findById(depositId);
            if (deposit) {
               deposits.push(deposit);
            }
         };
         return deposits;
      } catch(error: any) {
         throw error;
      }
   }
};

export default new DepositService;