export default class AuthError extends Error {
   constructor(message: string) {
     super(message);
     this.name = 'AuthError';
   };
};
 
class UserNotFoundError extends AuthError {
   constructor() {
     super('User not found');
     this.name = 'UserNotFoundError';
   };
};

class UserAccountIsNotActivatedError extends AuthError {
   constructor() {
     super('Account is not activated');
     this.name = 'UserAccountNotActivatedError';
   };
};

class UserAlreadyExistsError extends AuthError {
   constructor() {
     super('User already exists');
     this.name = 'UserAlreadyExistsError';
   };
};
 
class NotAuthorizedError extends AuthError {
   constructor() {
     super('Not authorized');
     this.name = 'NotAuthorizedError';
   };
};
 
class IncorrectPasswordError extends AuthError {
   constructor() {
     super('Incorrect password');
     this.name = 'IncorrectPasswordError';
   };
};

class IncorrectPin extends AuthError {
   constructor() {
     super('Incorrect pin');
     this.name = 'IncorrectPin';
   };
};
 
class IncorrectEmailError extends AuthError {
   constructor() {
     super('Incorrect email');
     this.name = 'IncorrectEmailError';
   };
};

class AccountIsNotFound extends AuthError {
   constructor() {
     super('Account is not found');
     this.name = 'IncorrectAccountId';
   };
};

class AccountIsBusy extends AuthError {
   constructor() {
     super('Account is Busy');
     this.name = 'AccountIsBusy';
   };
};

class CardIsNotFound extends AuthError {
   constructor() {
     super('Card is not found');
     this.name = 'CardIsNotFound';
   };
};

export {
   UserNotFoundError,
   UserAlreadyExistsError,
   NotAuthorizedError,
   IncorrectPasswordError,
   IncorrectEmailError,
   UserAccountIsNotActivatedError,
   AccountIsNotFound,
   CardIsNotFound,
   IncorrectPin,
   AccountIsBusy
};
 
