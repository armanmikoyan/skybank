import authUserMiddleware from "../middlewares/authenticationMiddleware";
import depositValidator from "../middlewares/depositValidationMiddleware"
import depositController from "../controllers/depositController";
import { Router } from "express";

export const depositRouter = Router();

depositRouter.get("/", authUserMiddleware, depositController.getAllDeposits);
depositRouter.post("/deposit/:type", authUserMiddleware, depositValidator.depositBodyMiddleware, depositValidator.depositParamMiddleware, depositController.deposit);


  