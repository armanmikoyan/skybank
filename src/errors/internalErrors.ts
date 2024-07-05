export default class InternalServerError extends Error {
   constructor(message: string) {
     super(message);
     this.name = 'Internal server error';
   };
};
 