import mongoose from "mongoose";
import { allLoanTypes, loanRates, status, LoanI } from "../interfaces/loanInterface";
import { Currency } from "../interfaces/transactions/transactionInterface";


const loanSchema = new mongoose.Schema<LoanI>({
   borrower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', 
      required: true
   },
   loanType: {
    type: String,
    enum: Object.values(allLoanTypes),
    required: true,
   },
   rate: {
      type: Number,
      required: true
   },
   amount: {
      type: Number,
      required: true
   },
   currency: {
      type : String,
      enum: Object.values(Currency),
      required: true
   },
   status: {
      type: String,
      enum: Object.values(status),
      default: status.Pending
   },
   createdAt: {
      type: Date,
      default: Date.now
   },
   updatedAt: {
      type: Date,
      default: Date.now
   }
});

export default mongoose.model<LoanI>('Loan', loanSchema);

