import { IsNotEmpty, IsNumber, IsEnum, Min } from 'class-validator';
import { allLoanTypes } from '../interfaces/loanInterface';
import { Currency } from '../interfaces/transactions/transactionInterface';

class LoanBodyValidator {
  @IsNotEmpty()
  @IsNumber()
  @Min(1, { message: 'Amount must not be >= 1' })
  amount: number;

  @IsNotEmpty()
  @IsEnum(Currency)
  currency: Currency
};

class LoanParamvalidator {
   @IsNotEmpty()
   @IsEnum(allLoanTypes)
   type: allLoanTypes;
};

export {
   LoanParamvalidator, 
   LoanBodyValidator
}

