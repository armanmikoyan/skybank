export default class TransactionError extends Error {
   constructor(message: string) {
     super(message);
     this.name = 'TransactionError';
   };
};
 
class NotEnoughBalance extends TransactionError {
   constructor() {
     super('Balance is not enough');
     this.name = 'NotEnoughBalance';
   };
};

class TheSameAccountNumber extends TransactionError {
   constructor() {
     super('You provided the same account numbers');
     this.name = 'TheSameAccountNumber';
   };
};


class InvalidTransactionType extends TransactionError {
   constructor() {
     super('Invalid Transaction Type, type must be TRANSFER, WITHDRAW, DEPOSIT, PAYMENT');
     this.name = 'InvalidTransactionType';
   }
};


export {
   TransactionError,
   NotEnoughBalance,
   TheSameAccountNumber,
   InvalidTransactionType
};
 
