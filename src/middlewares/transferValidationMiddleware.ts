import { Request, Response, NextFunction } from "express";
import { BaseValidator } from "./baseValidator";
import TransferDto, { TransactionValidatorViaPhone } from "../dto/transfer.dto"

class TransferValidator extends BaseValidator {
   transferValidationMiddleware(req: Request, res: Response, next: NextFunction) {
      return super.validate(TransferDto, req.body, res, next);
   }
   transferValidationViaPhoneMiddleware(req: Request, res: Response, next: NextFunction) {
      return super.validate(TransactionValidatorViaPhone, req.body, res, next);
   }

}

export default new TransferValidator;