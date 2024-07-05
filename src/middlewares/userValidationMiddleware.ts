import { Request, Response, NextFunction } from "express";
import { BaseValidator } from "./baseValidator";
import UserRegisterDto, { EmailChecker, PasswordChecker }  from "../dto/user.dto";

class UserValidator extends BaseValidator {
  constructor() {
    super();
  }
  registrationMiddleware(req: Request, res: Response, next: NextFunction) {
    return super.validate(UserRegisterDto, req.body, res, next);
  }
    
  emailValidation(req: Request, res: Response, next: NextFunction) {
    return super.validate(EmailChecker, req.body, res, next);
  }
 
  passwordValidation(req: Request, res: Response, next: NextFunction) {
    return super.validate(PasswordChecker, req.body, res, next);
  }
}

export default new UserValidator;


 
