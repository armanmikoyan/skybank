import mongoose from "mongoose";
import { Currency } from "./transactions/transactionInterface";

enum allDepositTypes {
   Saving = "Saving",
   TaxSaving = "TaxSaving",
   ChildSavings = "ChildSavings",
   ForeignCurrency = "ForeignCurrency"
}


enum depositRates {
   Saving = 10.0,
   TaxSaving = 19.12,
   ChildSavings = 12.1,
   ForeignCurrency = 999.0
}

interface DepositI {
   userId: mongoose.Schema.Types.ObjectId;
   accountId: mongoose.Schema.Types.ObjectId;
   depositType: allDepositTypes;
   amount: number;
   rate: number;
   currency: Currency;
   createdAt: Date;
   updatedAt: Date;
 }

export {
   allDepositTypes,
   depositRates,
   DepositI,
}