import { IsNotEmpty, MinLength, MaxLength, IsNumber, IsString, Min, Length, Matches } from 'class-validator';

export default class TransactionValidator {

  @MinLength(16, { message: "Account number must be exactly 16 digit " })
  @MaxLength(16, { message: "Account number must be exactly 16 digit " })
  creditNumber: string;

  @MinLength(16, { message: "Account number must be exacly 16 digit " })
  @MaxLength(16, { message: "Account number must be exacly 16 digit " })
  debitNumber: string;

  @IsNotEmpty() 
  @IsNumber()
  @Min(1, { message: 'Amount must not be >= 1' })
  amount: number;

  @IsNotEmpty()
  @IsString()
  password: string

  @IsString()
  notes?: string;
};

export class TransactionValidatorViaPhone {

  @MinLength(16, { message: "Account number must be exactly 16 digit " })
  @MaxLength(16, { message: "Account number must be exactly 16 digit " })
  creditNumber: string;

  @IsString()
  @Length(9, 9, { message: 'Phone number must be Armenian type 099999999' })
  @Matches(/^[0-9]+$/, {
    message: 'Phone number must contain only numbers',
  })
  debitNumber: string;

  @IsNotEmpty() 
  @IsNumber()
  @Min(1, { message: 'Amount must not be >= 1' })
  amount: number;

  @IsNotEmpty()
  @IsString()
  password: string

  @IsString()
  notes?: string;
};

