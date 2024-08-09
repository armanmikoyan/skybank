import  mongoose  from "mongoose";
import TransactionI from "../../interfaces/transactions/transactionInterface";
import { TransactionType, Status } from "../../interfaces/transactions/transactionInterface"; 


export default abstract class Transaction implements TransactionI {
   abstract modelFactory(): Promise<any>;
   abstract fetchAndValidateData(): Promise<void>;
   abstract performOperation(): Promise<void>;
   abstract record(): Promise<void>;

   type: TransactionType; 
   status: Status;
   date: Date;
   protected session: mongoose.ClientSession;

   constructor() {
      this.status = Status.PENDING;
      this.date = new Date();
   }

   async makeTransaction() {
      try {
         this.session = await mongoose.startSession();
         this.session.startTransaction();

         await this.fetchAndValidateData();
         await this.performOperation();
         await this.record();

         await this.session.commitTransaction();
      } catch (error: any) {
         await this.session.abortTransaction();
         throw error;
      } finally {
         await this.session.endSession();
      }
   }
}