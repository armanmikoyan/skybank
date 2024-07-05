import authController from "../controllers/authController";
import userValidator from "../middlewares/userValidationMiddleware";
import authUserMiddleware from "../middlewares/authenticationMiddleware";
import { Router } from "express"; 

export const authRouter = Router();

authRouter.post("/registration", userValidator.registrationMiddleware, authController.registration);
authRouter.post("/activateEmail", authController.activateEmail);
authRouter.post("/resendAccountActivationCode", userValidator.emailValidation, authController.resendCodeForAccountActivation);
authRouter.post("/login", userValidator.emailValidation, authController.login);
authRouter.get("/refreshAccessToken", authController.refreshAccessToken);
authRouter.post("/forgotPassword", userValidator.emailValidation, authController.forgotPassword);
authRouter.patch("/resetPassword", userValidator.passwordValidation, authController.resetPassword);
authRouter.patch("/changePassword", authUserMiddleware, userValidator.passwordValidation, authController.changePassword);
authRouter.get("/logout", authUserMiddleware, authController.logout);  

 