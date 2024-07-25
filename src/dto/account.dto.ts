import { IsNotEmpty, IsEnum , IsString , Length } from 'class-validator';
import { Currency } from '../interfaces/transactions/transactionInterface';
import { AccountType } from "../interfaces/accountInterface"

export default class AccountValidator {

  @IsNotEmpty()
  @IsEnum(Currency, { message: 'Currency  must be  "AMD, RUB, USD, EUR" ' })
  currency: Currency;

  @IsNotEmpty()
  @IsEnum(AccountType, { message: 'Account type  must be  "Current or Saving" ' })
  accountType: AccountType;
};

export class newAccountNameValidator {

   @IsString()
   @Length(0, 15, { message: 'Account name can be up to 15 characters long' })
   newAccountName: string & undefined;
 };


 



