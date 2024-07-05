import { Router } from "express";
import authUserMiddleware from "../middlewares/authenticationMiddleware";
import accountValidator from "../middlewares/accountValidationMiddlewate";  
import accountController from "../controllers/accountController";

export const accountsRouter = Router();
 
accountsRouter.post("/createAccount", authUserMiddleware, accountValidator.accountCreationMiddleware, accountController.createAccount);
accountsRouter.patch("/changeAccountName/:id", authUserMiddleware, accountValidator.changeAccountNameMiddleware, accountController.changeAccountName);
accountsRouter.delete("/deleteAccount/:id", authUserMiddleware, accountController.deleteAccount);


  