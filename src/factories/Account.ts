import AccountInterface from "../interfaces/accountInterface"
import { Currency } from '../interfaces/transactions/transactionInterface';
import { AccountType } from "../interfaces/accountInterface"


export default class Account implements AccountInterface {
   userId: string;
   accountNumber: string;
   currency: Currency;
   accountType: AccountType;
   balance: number; 
   accountName: string;
   hasCard: boolean;
   cardId: string;

   constructor(userId: string, accountName: string, accountType: AccountType, currency: Currency) {
      this.userId = userId;
      this.currency = currency;
      this.accountType = accountType;
      this.balance = 0;
      this.hasCard = false;
      this.accountName = accountName;
      this.accountNumber = this.#generateBankAccountNumber();
      this.cardId = "";
   }; 

   #generateBankAccountNumber() {
      let accountNumber = '';
      for (let i = 0; i < 16; i++) {
         accountNumber += Math.floor(Math.random() * 10);
      }
      return accountNumber;
  }
};