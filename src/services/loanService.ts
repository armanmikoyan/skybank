import userModel from "../models/userModel";
import loanModel from "../models/loanModel";
import { UserNotFoundError } from "../errors/authErrors";
import { LoanI, loanRates } from "../interfaces/loanInterface";
import { allLoanTypes } from "../interfaces/loanInterface";
import { Currency } from "../interfaces/transactions/transactionInterface";

class LoanService {
   async loan(userId: string, type: allLoanTypes, amount: number, currency: Currency) {
      try {
         const user = await userModel.findById(userId);
         if (!user) throw new UserNotFoundError;
         const loan = new loanModel({
            borrower: userId,
            loanType: type,
            amount,
            currency,
            rate: loanRates[type],
         });

         user.loans.push(loan._id.toString());
         await loan.save();
         await user.save();
      } catch(error: any) {
         throw error;
      }
   }

   async getLoans(userId: string, count: number): Promise<LoanI[]> {
      try {
         const user = await userModel.findById(userId);
         if (!user) throw new UserNotFoundError;   
         const loans: LoanI[] = []; 
         const loanIds = user.loans.slice(0, count);

         for (const loanId of loanIds) {
            const loan = await loanModel.findById(loanId);
            if (loan) {
               loans.push(loan);
            }
         };
         return loans;
      } catch(error: any) {
         throw error;
      }
   }
};

export default new LoanService;