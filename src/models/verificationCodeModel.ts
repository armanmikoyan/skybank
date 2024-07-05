import mongoose, { Schema } from "mongoose";

const verificationCodeSchema = new Schema({
    code: 
    { 
      type: String,
      required: true,
    },
    email: { 
      type: String, 
      required: true,
   },
   expiresAt: { 
    type: Date, 
    required: true, 
  },
});

export default mongoose.model("verificationCodes", verificationCodeSchema);
