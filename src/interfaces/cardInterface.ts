export enum CardType {
   Visa = 'Visa',
   Master = 'Master',
}

export interface CardPayloadFromSystemInterface {  // It'll be added from system
   cardNumber: string,
   expirationDate: Date,
   cvv: string,
   currency: string;
   pin: string,
};

export interface CardPayloadFromUserInterface {  // It'll be added from user
   userId: string,
   accountId: string,
   cardHolderName: string,
   cardType: string,
   cardName: string | undefined,
};


export default interface CardInterface extends CardPayloadFromSystemInterface, CardPayloadFromUserInterface {
   balance: number;
};

