import mongoose, { Schema } from "mongoose";
import { Currency } from "../interfaces/transactions/transactionInterface";
import { AccountType } from "../interfaces/accountInterface";

const AccountSchema = new Schema({
   userId: {
      type: String,
      required: true
   },
   cardId: {
      type: String, 
   },
   accountNumber: { 
      type: String, 
      required: true,
   },
   balance: { 
      type: Number, 
      default: 0,
      required: true,
   },
   currency: { 
      type: String, 
      enum: Currency,
      required: true,
   },
   accountType: {
      type: String,
      enum: AccountType,
      required: true,
   },
   accountName: { 
      type: String, 
      default: "default name",
   },
   hasCard: {
      type: Boolean,
      default: false,
   },
})

export default mongoose.model("Account", AccountSchema);
 

  
  
 
 
  