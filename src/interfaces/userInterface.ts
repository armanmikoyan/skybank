export enum UserRoles {
   ADMIN = 'ADMIN',
   USER = 'USER',
};

export interface UserInterface {
   email: string,
   password: string,
   firstName: string,
   lastName: string,
   phone: string,
   isVerified: boolean,
   birthDate: String,
   accounts: string[],
   cards: string[],
   transactions: {
      transfers: string[],
      withdraws: string[],
   },
};
