import mongoose, { Schema } from "mongoose";
import { UserInterface } from "../interfaces/userInterface";

const userSchema: Schema<UserInterface> = new Schema({
   email: {
      type: String,
      required: true,
      unique: true,
   },
   password: { 
      type: String, 
      required: true 
   },
   firstName: {
      type: String,
      required: true,
   },
   lastName: {
      type: String,
      required: true,
   },
   phone: {
      type: String,
      required: true,
   },
    birthDate: {
      type: Date,
    },
    isVerified: {
      type: Boolean,
      required: true,
    },
    accounts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Account",
      },
    ],
    cards: [
      {
        type: Schema.Types.ObjectId,
        ref: "Card",
      },
   ],
})

export default mongoose.model("User", userSchema);
