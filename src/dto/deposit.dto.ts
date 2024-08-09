import { IsNotEmpty, IsNumber, IsEnum, Min, IsString, ValidateIf, IsMongoId } from 'class-validator';
import { allDepositTypes  } from '../interfaces/depositInterface';
import { Currency } from '../interfaces/transactions/transactionInterface';

class DepositBodyValidator {

  @IsString()
  @ValidateIf(o => o.accountId !== undefined && o.accountId !== null && o.accountId !== '')
  @IsMongoId({ message: 'accountId must be a valid MongoDB ObjectId or empty to create default account' })
  accountId: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1, { message: 'Amount must not be >= 1' })
  amount: number;

  @IsNotEmpty()
  @IsEnum(Currency)
  currency: Currency
};

class DepositParamValidator {
   @IsNotEmpty()
   @IsEnum(allDepositTypes)
   type: allDepositTypes;
};

export {
   DepositBodyValidator, 
   DepositParamValidator
}

