import mongoose, { Schema } from "mongoose";
import { TransferMongoDodumentI } from "../interfaces/transactions/transferInterface"
import { TransactionType, Status, Currency } from "../interfaces/transactions/transactionInterface"


const transferSchema = new Schema<TransferMongoDodumentI>({
   type: {
      type: String, 
      enum: Object.values(TransactionType), 
      required: true,
   },
   creditNumber: {
      type: String,
      required: true,
   },
   debitNumber: {
      type: String,
      required: true,
   },
   creditCurrency: {
      type: String,
      enum: Object.values(Currency),
      required: true,
   },
   debitCurrency: {
      type: String,
      enum: Object.values(Currency),
      required: true,
   },
   creditAmount: {
      type: Number,
      required: true,
   },
   debitAmount: {
      type: Number,
      required: true,
   },
   date: { 
      type: Date, 
      required: true 
   },
   status: { 
      type: String, 
      enum: Object.values(Status), 
      required: true 
   },
   notes: { 
      type: String 
   },
});

export default mongoose.model("Transfer", transferSchema);