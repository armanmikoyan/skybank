import { Currency } from "./transactions/transactionInterface";

export enum AccountType {
   Current = "Current",
   Saving = "Saving",
}

export interface AccountPayloadFromSystemInterface {  // It'll be added from system
   accountNumber: string,
   balance: number,
   hasCard: boolean;
};

export interface AcountPayloadFromUserInterface {  // It'll be added from user
   accountType: AccountType,
   currency: Currency,
   userId: string,
   accountName: string;
};

export default interface AccountInterface extends AcountPayloadFromUserInterface, AccountPayloadFromSystemInterface {
   cardId: string;
};

