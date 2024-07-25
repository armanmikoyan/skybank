export default class AuthError extends Error {
   constructor(message: string) {
     super(message);
     this.name = 'AuthError';
   };
};
 
class UserNotFoundError extends AuthError {
   constructor(message?: string) {
     super(message ?? 'User not found');
     this.name = message ?? 'UserNotFoundError';
   };
};

class UserAccountIsNotActivatedError extends AuthError {
   constructor() {
     super('Account is not activated');
     this.name = 'UserAccountNotActivatedError';
   };
};

class UserAlreadyExistsError extends AuthError {
   constructor(message: any) {
     super(message ?? 'User already exists');
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
   constructor(message?: string) {
     super(message ?? 'Account is not found');
     this.name = "AccountIsNotFound";
   };
};

class AccountIsBusy extends AuthError {
   constructor() {
     super('Account is Busy');
     this.name = 'AccountIsBusy';
   };
};

class CardIsNotFound extends AuthError {
   constructor(message?: string) {
     super(message ?? 'Card is not found');
     this.name ='CardIsNotFound';
   };
};

class IncompatibeError extends AuthError {
   constructor(message?: string) {
     super(message ?? 'Card and Account are not compatible');
     this.name = 'IncompatibeError';
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
   AccountIsBusy,
   IncompatibeError
};
 
