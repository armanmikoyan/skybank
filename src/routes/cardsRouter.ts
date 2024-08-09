import authUserMiddleware from "../middlewares/authenticationMiddleware";
import cardValidator from "../middlewares/cardValidationMiddleware";
import cardController from "../controllers/cardController";
import transferValidator from "../middlewares/transferValidationMiddleware";
import { Router } from "express";

export const cardsRouter = Router();

cardsRouter.get("/", authUserMiddleware, cardController.getCards);
cardsRouter.post("/createCard", authUserMiddleware, cardValidator.cardCreationMiddleware, cardController.createCard);
cardsRouter.patch("/changeCardName/:id", authUserMiddleware, cardValidator.cardChangeNameMiddleware, cardController.changeCardName);
cardsRouter.patch("/changePin/:id", authUserMiddleware, cardValidator.cardChangePinMiddleware, cardController.changePin);
cardsRouter.delete("/deleteCard/:id", authUserMiddleware, cardController.deleteCard);

cardsRouter.post("/transactions/transfer/card-to-account", authUserMiddleware, transferValidator.transferValidationMiddleware, cardController.transferToAccount)
cardsRouter.post("/transactions/transfer/card-to-card", authUserMiddleware, transferValidator.transferValidationMiddleware, cardController.transferToCard);
cardsRouter.post("/transactions/transfer/viaPhoneNumber", authUserMiddleware, transferValidator.transferValidationViaPhoneMiddleware, cardController.transferViaPhoneNumber);
  