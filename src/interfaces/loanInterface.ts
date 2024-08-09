import mongoose from "mongoose";
import { Currency } from "./transactions/transactionInterface";

enum allLoanTypes {
   StudentLoan = "StudentLoan",
   AutoLoan = "AutoLoan",
   BusinessLoan = "BusinessLoan",
   VacationLoan = "VacationLoan"
}

enum status {
   Pending = "Pending",
   Approved = "Approved",
   Rejected = "Rejected",
}


enum loanRates {
   StudentLoan = 10.0,
   AutoLoan = 19.12,
   BusinessLoan = 12.1,
   VacationLoan = 999.0
}

interface LoanI {
   borrower: mongoose.Schema.Types.ObjectId;
   loanType: allLoanTypes;
   amount: number;
   rate: number;
   currency: Currency;
   createdAt: Date;
   updatedAt: Date;
   status: status
}

export {
   LoanI,
   allLoanTypes,
   loanRates,
   status
}