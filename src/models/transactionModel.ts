import mongoose, { Schema } from "mongoose";
import { TransactionMongoDodumentI, TransactionType, Status } from "../interfaces/transactions/transactionInterface"

const transactionSchema = new Schema<TransactionMongoDodumentI>({
  type: {
    type: String, 
    enum: Object.values(TransactionType), 
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
});

export default mongoose.model("Transaction", transactionSchema);