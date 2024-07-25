import authUserMiddleware from "../middlewares/authenticationMiddleware";
import historyController from "../controllers/historyController";
import { Router } from "express";

export const historyRouter = Router();

historyRouter.get("/transactions/:type", authUserMiddleware, historyController.fetchTransactions);

  