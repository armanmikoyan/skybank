import { Schema, Document } from "mongoose";

enum TransactionType {
   TRANSFER = "TRANSFER",
   WITHDRAW = "WITHDRAW",
   DEPOSIT = "DEPOSIT",
   PAYMENT = "PAYMENT"
};

enum Currency {
   AMD = "AMD",
   EUR = "EUR",
   USD = "USD",
   RUB = "RUB"
}

enum Status {
   PENDING = "PENDING",
   REJECTED = "REJECTED",
   CONFIRMED = "CONFIRMED",
}

interface FilterI {
   count: number | null,
   creditCurrency: Currency | null,
   debitCurrency: Currency | null,
   before_date: Date | null,
   after_date: Date | null,
   creditMaxAmount: number | typeof Infinity,
   creditMinAmount: number | typeof Infinity,
   debitMaxAmount: number | typeof Infinity,
   debitMinAmount: number | typeof Infinity,
}


export default interface TransactionI {
   type: TransactionType; 
   date: Date;
   status: Status;
}

interface TransactionMongoDodumentI extends TransactionI, Document {
   ref: Schema.Types.ObjectId;
}

export {
   TransactionMongoDodumentI,
   TransactionType,
   Currency,
   Status,
   FilterI,
}



