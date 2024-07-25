import { Length, IsEmail, IsNotEmpty, IsString, Matches, MinLength, MaxLength, } from "class-validator";

export default class UserRegister {
  @IsString()
  @Matches(/^[A-Z][a-zA-Z]*$/, { message: "First name must start with an uppercase letter and not include numbers" })
  @Length(3, 20)
  firstName: string;

  @IsString()
  @Matches(/^[A-Z][a-zA-Z]*$/, { message: "Last name must start with an uppercase letter, and not include numbers" })
  @Length(3, 20)
  lastName: string;
 
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @Length(9, 9, { message: 'Phone number must be Armenian type 099999999' })
  @Matches(/^[0-9]+$/, {
    message: 'Phone number must contain only numbers',
  })
  phone: string;

  @IsString()
  @Matches(/^\d{2} \d{2} \d{4}$/, {
     message: 'Date must be in the format "dd mm yy"',
  })
   birthDate: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: "Password must be at least 8 characters long" })
  @MaxLength(30, { message: "Password must be at most 30 characters long" })
  @Matches(/^(?=.*[A-Z])(?=.*\d).+$/, 
  {
   message: "Password must contain at least 1 uppercase letter and 1 number",
  })
  password: string;
};

export class EmailChecker {

  @IsString()
  @IsEmail()
  email: string;
}

export class PasswordChecker {

  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: "Password must be at least 8 characters long" })
  @MaxLength(30, { message: "Password must be at most 30 characters long" })
  @Matches(/^(?=.*[A-Z])(?=.*\d).+$/, 
  {
    message: "Password must contain at least 1 uppercase letter and 1 number",
  })
  newPassword: string;
}
