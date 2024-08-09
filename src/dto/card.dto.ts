import { IsNotEmpty, IsString, IsEnum, Length, Matches, IsMongoId, ValidateIf } from 'class-validator';
import { CardType } from "../interfaces/cardInterface"

export default class CardValidator {
  @IsNotEmpty()
  @IsEnum(CardType, { message: 'cardType must be either "Visa" or "Master"' })
  cardType: CardType;

  @IsString()
  @ValidateIf(o => o.accountId !== undefined && o.accountId !== null && o.accountId !== '')
  @IsMongoId({ message: 'accountId must be a valid MongoDB ObjectId or empty to create default account' })
  accountId: string;

  @IsString()
  @Length(0, 15, { message: 'cardName can be up to 15 characters long' })
  cardName: string & undefined;
};


export class newCardNameValidator {
  @IsString()
  @Length(0, 15, { message: 'cardName can be up to 15 characters long' })
  newCardName: string & undefined;
};

export class newPinValidator {
  @IsNotEmpty()
  @Matches(/^\d{4,6}$/, { message: 'pin must be a 4 to 6 digit number' })
  oldPin: string;

  @IsNotEmpty()
  @Matches(/^\d{4,6}$/, { message: 'pin must be a 4 to 6 digit number' })
  newPin: string;
};


