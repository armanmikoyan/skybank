import AccountInterface from "../interfaces/accountInterface"

export default class Account implements AccountInterface {
   userId: string;
   accountNumber: string;
   currency: string;
   accountType: string;
   balance: number; 
   accountName: string;
   hasCard: boolean;

   constructor(userId: string, accountName: string, accountType: string, currency: string) {
      this.userId = userId;
      this.currency = currency;
      this.accountType = accountType;
      this.balance = 0;
      this.hasCard = false;
      this.accountName = accountName;
      this.accountNumber = this.#generateBankAccountNumber();
   }; 

   #generateBankAccountNumber() {
      let accountNumber = '';
      for (let i = 0; i < 12; i++) {
         accountNumber += Math.floor(Math.random() * 10);
      }
      return accountNumber;
  }
};