import authUserMiddleware from "../middlewares/authenticationMiddleware";
import LoanValidator from "../middlewares/loanValidationMiddleware"
import loanController from "../controllers/loanController";
import { Router } from "express";

export const loanRouter = Router();

loanRouter.get("/", authUserMiddleware, loanController.getAllLoans);
loanRouter.post("/loan/:type", authUserMiddleware, LoanValidator.loanBodyMiddleware, LoanValidator.loanParamMiddleware, loanController.loan);


  