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
   birthDate: Date,
   accounts: string[],
   cards: string[],
   isVerified: boolean,
};
