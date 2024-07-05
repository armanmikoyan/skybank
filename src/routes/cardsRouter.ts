import authUserMiddleware from "../middlewares/authenticationMiddleware";
import cardValidator from "../middlewares/cardValidationMiddleware";
import cardController from "../controllers/cardController";
import { Router } from "express";

export const cardsRouter = Router();

cardsRouter.post("/createCard", authUserMiddleware, cardValidator.cardCreationMiddleware, cardController.createCard);
cardsRouter.patch("/changeCardName/:id", authUserMiddleware, cardValidator.cardChangeNameMiddleware, cardController.changeCardName);
cardsRouter.delete("/deleteCard/:id", authUserMiddleware, cardController.deleteCard);


  