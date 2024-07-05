import mongoose, { Schema } from "mongoose";

const AccountSchema = new Schema({
   userId: {
      type: String,
      required: true
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
      enum: ["AMD", "RUB", "USD", "EUR"],
      required: true,
   },
   accountType: {
      type: String,
      enum: ["Current", "Saving"],
      required: true,
   },
   accountName: { 
      type: String, 
      default: "default name",
   },
   hasCard: {
      type: Boolean,
      default: false,
   }
})

export default mongoose.model("Account", AccountSchema);
 

  
  
 
 
  