import { Router } from "express";
import authUserMiddleware from "../middlewares/authenticationMiddleware";
import generalController from "../controllers/generalController";

export const generalRouter = Router();
 
generalRouter.get("/allCurrencies", authUserMiddleware, generalController.allCurrencies);
generalRouter.get("/allLoanTypes", authUserMiddleware, generalController.allLoanTypes);
generalRouter.get("/allDepositTypes", authUserMiddleware, generalController.allDepositTypes);

 