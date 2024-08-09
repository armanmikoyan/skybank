import { Request, Response, NextFunction } from "express";
import { BaseValidator } from "./baseValidator";
import { DepositBodyValidator, DepositParamValidator} from "../dto/deposit.dto"

class DepositValidator extends BaseValidator {
   depositBodyMiddleware(req: Request, res: Response, next: NextFunction) {
      return super.validate(DepositBodyValidator, req.body, res, next);
   }
   
   depositParamMiddleware(req: Request, res: Response, next: NextFunction) {
      return super.validate(DepositParamValidator, req.params, res, next);
   }

}

export default new DepositValidator;