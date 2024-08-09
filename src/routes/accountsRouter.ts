import { Router } from "express";
import authUserMiddleware from "../middlewares/authenticationMiddleware";
import accountValidator from "../middlewares/accountValidationMiddleware";  
import transferValidator from "../middlewares/transferValidationMiddleware";
import accountController from "../controllers/accountController";

export const accountsRouter = Router();
 
accountsRouter.get("/", authUserMiddleware, accountController.getAccounts);
accountsRouter.post("/createAccount", authUserMiddleware, accountValidator.accountCreationMiddleware, accountController.createAccount);
accountsRouter.patch("/changeAccountName/:id", authUserMiddleware, accountValidator.changeAccountNameMiddleware, accountController.changeAccountName);
accountsRouter.delete("/deleteAccount/:id", authUserMiddleware, accountController.deleteAccount);

accountsRouter.post("/transactions/transfer/account-to-account", authUserMiddleware, transferValidator.transferValidationMiddleware, accountController.transferToAccount)
accountsRouter.post("/transactions/transfer/account-to-card", authUserMiddleware, transferValidator.transferValidationMiddleware, accountController.transferToCard);
accountsRouter.post("/transactions/transfer/viaPhoneNumber", authUserMiddleware, transferValidator.transferValidationViaPhoneMiddleware, accountController.transferViaPhoneNumber);
accountsRouter.post("/transactions/transfer/viaQRCode", authUserMiddleware, transferValidator.transferValidationMiddleware, accountController.transferToAccount)

