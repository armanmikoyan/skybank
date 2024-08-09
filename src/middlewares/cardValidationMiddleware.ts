import { Request, Response, NextFunction } from "express";
import { BaseValidator } from "./baseValidator";
import CardCreateDto, { newCardNameValidator, newPinValidator } from "../dto/card.dto"

class CardValidator extends BaseValidator {
   cardCreationMiddleware(req: Request, res: Response, next: NextFunction) {
      return super.validate(CardCreateDto, req.body, res, next);
   }

   cardChangeNameMiddleware(req: Request, res: Response, next: NextFunction) {
      return super.validate(newCardNameValidator, req.query, res, next);
   }

   cardChangePinMiddleware(req: Request, res: Response, next: NextFunction) {
      return super.validate(newPinValidator, req.body, res, next);
   }
}

export default new CardValidator;