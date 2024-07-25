import TransactionI, { Currency } from "./transactionInterface";

export default interface TransferI {
   creditNumber: string;   
   debitNumber: string;
   creditAmount: number;
   notes: string;
} 

interface TransferMongoDodumentI extends TransferI, TransactionI, Document {
   creditCurrency: Currency,
   debitCurrency: Currency
   debitAmount: number
};

export {
   TransferMongoDodumentI,
}