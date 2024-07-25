import { Request, Response, NextFunction } from "express";
import { BaseValidator } from "./baseValidator";
import CardCreateDto, { newAccountNameValidator } from "../dto/account.dto"

class AccountValidator extends BaseValidator {
   accountCreationMiddleware(req: Request, res: Response, next: NextFunction) {
      return super.validate(CardCreateDto, req.body, res, next);
   }

   changeAccountNameMiddleware(req: Request, res: Response, next: NextFunction) {
      return super.validate(newAccountNameValidator, req.query, res, next);
   }
}

export default new AccountValidator;