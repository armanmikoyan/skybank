import mongoose from "mongoose";
import { DepositI, allDepositTypes } from "../interfaces/depositInterface";
import { Currency } from "../interfaces/transactions/transactionInterface";

const depositSchema = new mongoose.Schema<DepositI>({
   userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', 
      required: true
   },
   depositType: {
    type: String,
    enum: Object.values(allDepositTypes),
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
   createdAt: {
      type: Date,
      default: Date.now
   },
   updatedAt: {
      type: Date,
      default: Date.now
   }
});

export default mongoose.model<DepositI>('Deposit', depositSchema);

