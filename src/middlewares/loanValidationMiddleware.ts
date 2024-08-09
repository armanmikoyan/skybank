import { Request, Response, NextFunction } from "express";
import { BaseValidator } from "./baseValidator";
import { LoanBodyValidator, LoanParamvalidator} from "../dto/loan.dto"

class LoanValidator extends BaseValidator {
   loanBodyMiddleware(req: Request, res: Response, next: NextFunction) {
      return super.validate(LoanBodyValidator, req.body, res, next);
   }
   
   loanParamMiddleware(req: Request, res: Response, next: NextFunction) {
      return super.validate(LoanParamvalidator, req.params, res, next);
   }

}

export default new LoanValidator;