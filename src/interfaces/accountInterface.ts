export interface AccountPayloadFromSystemInterface {  // It'll be added from system
   accountNumber: string,
   balance: number,
   hasCard: boolean;
};

export interface AcountPayloadFromUserInterface {  // It'll be added from user
   accountType: string,
   currency: string,
   userId: string,
   accountName: string;
};

export default interface AccountInterface extends AcountPayloadFromUserInterface, AccountPayloadFromSystemInterface {};

