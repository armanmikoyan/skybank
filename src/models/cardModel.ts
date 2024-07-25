import mongoose, { Schema } from "mongoose";
import { Currency } from "../interfaces/transactions/transactionInterface";
import { CardType } from "../interfaces/cardInterface";

const CardSchema: Schema = new Schema({
   userId: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true,
   },
   accountId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Account', 
      required: true,
   },
   cardNumber: { 
      type: String, 
      required: true 
   },
   cardHolderName: { 
      type: String, 
      required: true 
   },
   expirationDate: { 
      type: String, 
      required: true 
   },
   cvv: { 
      type: String, 
      required: true 
   },
   pin: { 
      type: String, 
      required: true 
   },
   cardType: { 
      type: String, 
      enum: CardType, 
      required: true 
   },
   cardName: { 
      type: String, 
      default: "default name",
   },
   currency: { 
      type: String, 
      enum: Currency,
      required: true,
   },
   balance: {
      type: Number,
      required: true,
      default: 0,
   },
});

export default mongoose.model("Card", CardSchema);