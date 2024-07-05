import { IsNotEmpty, IsString, IsEnum, Length, Matches, IsMongoId } from 'class-validator';

enum CardType {
  Visa = 'Visa',
  Master = 'Master',
}

enum Currency {
  AMD = "AMD",
  RUB = "RUB",
  USD = "USD",
  EUR = "EUR",
}

export default class CardValidator {
  @IsNotEmpty()
  @Matches(/^\d{4,6}$/, { message: 'pin must be a 4 to 6 digit number' })
  pin: string;

  @IsNotEmpty()
  @IsEnum(CardType, { message: 'cardType must be either "Visa" or "Master"' })
  cardType: CardType;

  @IsNotEmpty()
  @IsEnum(Currency, { message: 'currency must be AMD, RUB, USD OR EUR' })
  currency: CardType;

  @IsNotEmpty()
  @IsMongoId()
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

