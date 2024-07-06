import CardInterface from "../interfaces/cardInterface"

export default class Card implements CardInterface {
   cardNumber: string;
   expirationDate: Date;
   cvv: string;
   userId: string;
   cardHolderName: string;
   pin: string;
   cardType: string;
   cardName: string | undefined;
   currency: string;
   accountId: string;
   balance: number;
   

   constructor(userId: string, accountId: string, cardHolderName: string, pin: string, cardType: string, cardName: string | undefined, currency: string) {
      this.cardNumber = this.#generateCardNumber();
      this.expirationDate = this.#generateExpirationDate();
      this.cvv = this.#generateCvv();
      this.userId = userId;
      this.accountId = accountId;
      this.cardHolderName = cardHolderName;
      this.pin = pin;
      this.cardType = cardType;
      this.cardName = cardName;
      this.currency = currency
      this.balance = 0;
   }; 

   #generateCardNumber(): string { 
      let cardNumber = '';
      const masterPrefixes = ['51', '52', '53', '54', '55'];
      const visaPrefix = '4'

      for (let i = 0; i < 16; i++) {
         cardNumber += Math.floor(Math.random() * 10);
      }
      if (this.cardType === 'Visa') {
         cardNumber = visaPrefix + cardNumber.slice(0, 15);
      } else if (this.cardType === 'Master') {
         const masterPrefix = masterPrefixes[Math.floor(Math.random() * masterPrefixes.length)];
         cardNumber = masterPrefix + cardNumber.slice(0, 14);
      }
      return cardNumber;
   }

   #generateExpirationDate(): Date { 
      const expiresAtYears = 3;
      const currentDate = new Date();
      return new Date(currentDate.setFullYear(currentDate.getFullYear() + expiresAtYears));
   } 

   #generateCvv(): string {
      const cvv = Math.floor(100 + Math.random() * 900).toString();
      return cvv;
   };
};