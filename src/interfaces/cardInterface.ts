export interface CardPayloadFromSystemInterface {  // It'll be added from system
   cardNumber: string,
   expirationDate: Date,
   cvv: string,
};

export interface CardPayloadFromUserInterface {  // It'll be added from user
   userId: string,
   accountId: string,
   cardHolderName: string,
   pin: string,
   cardType: string,
   cardName: string | undefined,
   currency: string;
};


export default interface CardInterface extends CardPayloadFromSystemInterface, CardPayloadFromUserInterface {
   balance: number;
};

