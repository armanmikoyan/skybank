import TransferI, { TransferMongoDodumentI }  from "../../../interfaces/transactions/transferInterface"
import { TransactionType, Currency, Status, FilterI } from "../../../interfaces/transactions/transactionInterface"; 
import { AccountIsNotFound, CardIsNotFound, UserNotFoundError } from "../../../errors/authErrors";
import { NotEnoughBalance, TheSameAccountNumber } from "../../../errors/transactionErrors";
import InternalServerError from "../../../errors/internalErrors";
import accountModel from "../../../models/accountModel";
import userModel from "../../../models/userModel";
import transferModel from "../../../models/transferModel";
import Transaction from "../transactionService"
import currencyConverter from "../../../utils/currencyConferter"
import cardModel from "../../../models/cardModel";

export class Transfer extends Transaction implements TransferI {
   creditNumber: string;
   debitNumber: string;
   creditAmount: number;
   notes: string;

   creditAccount: any;
   debitAccount: any;
   creditCurrency: Currency;
   debitCurrency: Currency;
   debitAmount: number
   creditAccountOwner: any;
   debitAccountOwner: any;

   constructor({creditNumber, debitNumber, creditAmount, notes}: TransferI) {
      super();
      this.creditNumber = creditNumber;
      this.debitNumber = debitNumber;
      this.creditAmount = creditAmount;
      this.notes = notes;
      this.type = TransactionType.TRANSFER;
   }

   async fetchAndValidateData(): Promise<void> {
      try {
         this.creditAccount = await accountModel.findOne({accountNumber: this.creditNumber});
         if (!this.creditAccount) throw new AccountIsNotFound("Credit Account is not found");
   
         this.creditAccountOwner = await userModel.findById(this.creditAccount.userId);
         if (!this.creditAccountOwner) throw new UserNotFoundError("Credit user is not found");
   
         this.debitAccount = await accountModel.findOne({accountNumber: this.debitNumber});
         if (!this.debitAccount) throw new AccountIsNotFound("Debit Account is not found");

         if (this.creditAccount._id.toString() === this.debitAccount._id.toString()) throw new TheSameAccountNumber;
   
         this.debitAccountOwner = await userModel.findById(this.debitAccount.userId);
         if (!this.debitAccountOwner) throw new UserNotFoundError("Debit user is not found");
   
         this.creditCurrency = this.creditAccount.currency;
         this.debitCurrency = this.debitAccount.currency;
   
      } catch(error: any) {
         throw error;
      }
   }

   async performOperation(): Promise<void> {   
      if (this.creditAccount.balance < this.creditAmount) throw new NotEnoughBalance;

      try { 
         if (this.creditCurrency != this.debitCurrency) {
            const { success, result: convertedAmount } = await currencyConverter(this.creditCurrency, this.debitCurrency, this.creditAmount);
            if (!success) throw new InternalServerError("Error converting currencies");
   
            this.debitAccount.balance += convertedAmount;
            this.debitAmount = convertedAmount
         } else {
            this.debitAmount = this.creditAmount;
            this.debitAccount.balance += this.creditAmount;
         }
         this.creditAccount.balance -= this.creditAmount;
         await this.creditAccount.save({ session: this.session });
         await this.debitAccount.save({ session: this.session });
         await this.syncCardAccountBalance(); 
      } catch(error: any) {
         throw error;
      } 
   }

   async record(): Promise<void> {
      try {
         const tranfer = await this.modelFactory();
         tranfer.status = Status.CONFIRMED;

         await tranfer.save({ session: this.session });
           
         await userModel.findByIdAndUpdate(
            this.creditAccountOwner._id,
            { $addToSet: { "transactions.transfers": tranfer._id} }, 
            { new: true, useFindAndModify: false, session: this.session }
          ).session(this.session);
   
          await userModel.findByIdAndUpdate(
            this.debitAccountOwner._id,
            { $addToSet: { "transactions.transfers": tranfer._id} }, 
            { new: true, useFindAndModify: false, session: this.session }
          ).session(this.session);
      } catch(error: any) {
         throw error;
      }
   }

   async modelFactory(): Promise<any> {
      return new transferModel({
         creditNumber: this.creditNumber,
         debitNumber: this.debitNumber,
         creditAmount: this.creditAmount,
         debitAmount: this.debitAmount,
         creditCurrency: this.creditCurrency,
         debitCurrency: this.debitCurrency,
         type: this.type,
         date: this.date,
         status: this.status,
         notes: this.notes
      });
   }

   async syncCardAccountBalance() {
      let creditCard;
      let debitCard;
      try {
         if (this.creditAccount.cardId != '') {
            creditCard = await cardModel.findById(this.creditAccount.cardId);
            if (!creditCard) throw new CardIsNotFound;
            creditCard.balance = this.creditAccount.balance;
            await creditCard.save({ session: this.session });
         }
         if (this.debitAccount.cardId != '') {
            debitCard = await cardModel.findById(this.debitAccount.cardId);      
            if (!debitCard) throw new CardIsNotFound;
            debitCard.balance = this.debitAccount.balance;
            await debitCard.save({ session: this.session });
         }
      } catch(error: any) {
         throw error;
      }
   }

   static async getTransfers(userId: string, filters: any): Promise<TransferMongoDodumentI[]> {
      try {
         const user = await userModel.findById(userId);
         if (!user) throw new UserNotFoundError;

         let transfers: TransferMongoDodumentI[] = [];
         const transferIds = user.transactions.transfers.slice(0, filters.count);

         for (const transferId of transferIds) {
            transfers.push(await transferModel.findById(transferId) as TransferMongoDodumentI);
         };
         
         transfers = this.filterArray(transfers, filters);
         return transfers;

      } catch(error: any) {
         throw error;
      }
   }


   static async getWithdraws(userId: string, filters: any):Promise<any[]> { return [];};
   static async getDeposits(userId: string, filters: any): Promise<any[]>{ return [];};
   static async getPayments(userId: string, filters: any): Promise<any[]> { return [];};

   private static filterArray(array: any[], filters: any): any[] {
      for (let filter in filters) {
          if (filters[filter]) {
              switch (filter) {
                  case 'creditCurrency':
                     array = array.filter((obj: any) => obj.creditCurrency === filters[filter]);
                     break;
                  case 'debitCurrency':
                     array = array.filter((obj: any) => obj.debitCurrency === filters[filter]);
                     break;
                  case 'creditMaxAmount':
                     array = array.filter((obj: any) => obj.creditAmount <= filters[filter]);
                     break;
                  case 'creditMinAmount':
                     array = array.filter((obj: any) => obj.creditAmount >= filters[filter]);
                     break;
                  case 'debitMaxAmount':
                     array = array.filter((obj: any) => obj.debitAmount <= filters[filter]);
                     break;
                  case 'debitMinAmount':
                     array = array.filter((obj: any) => obj.debitAmount >= filters[filter]);
                     break;
                  case 'before_date':
                     array = array.filter((obj: any) => obj.date.getTime() <= filters[filter].getTime());
                     break;
                  case 'after_date':
                     array = array.filter((obj: any) => obj.date.getTime() >= filters[filter].getTime());
                     break;
                  default:
                     break;
              }
          }
      }
      return array;
  }
  
}
