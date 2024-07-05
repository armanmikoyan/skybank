export default class TokenError extends Error {
   constructor(message: string) {
     super(message);
     this.name = 'TokenError';
   };
};
 
class TokenExpiredError extends TokenError {
   constructor() {
     super('Token has expired');
     this.name = 'TokenExpiredError';
   };
};

class InvalidTokenError extends TokenError {
   constructor() {
     super('Invalid token');
     this.name = 'InvalidTokenError';
   };
};

export {
   TokenExpiredError,
   InvalidTokenError
};
 
