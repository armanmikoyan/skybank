import authService from "../services/authService";
import InternalServerError from "../errors/internalErrors";
import { Request, Response } from "express";
import { TokenExpiredError, InvalidTokenError } from "../errors/tokenErrors";
import { UserAlreadyExistsError, UserNotFoundError, UserAccountIsNotActivatedError, IncorrectPasswordError, NotAuthorizedError } from "../errors/authErrors";

class AuthController {
   
   async registration(req: Request, res: Response) {
      const { email, password, firstName, lastName, phone, birthDate } = req.body;
      try {
         await authService.registration(
         {  email, 
            password, 
            firstName, 
            lastName, 
            phone,  
            birthDate, 
            accounts:[], 
            cards:[],  
            isVerified: false,
         });
         res.status(200).json({ message: `Verification code sent to your email`, email});
      } catch(error: any) {
         if (error instanceof UserAlreadyExistsError) {
            res.status(409).json({ error: error.message });
         } else if (error instanceof InternalServerError) {
            res.status(500).json({ error: error.message }); 
         } else {
            res.status(501).json({ error: error.message });   
         }
      }
   }

   async activateEmail(req: Request, res: Response) {
      const { code } = req.body;
      try {
         await authService.checkCodeAndRegisterUser(code);
         res.status(201).json({ message: "Email Activated Successfully" });
      } catch(error: any) {
         if (error instanceof TokenExpiredError || error instanceof TokenExpiredError) {
            res.status(401).json({ error: error.message });
         } else if (error instanceof InternalServerError) {
            res.status(500).json({ error: error.message }); 
         } else {
            res.status(501).json({ error: error.message });
         }
      }
   }

   async resendCodeForAccountActivation(req: Request, res: Response) {
      const { email } = req.body;
      try {
         await authService.emailVeridicationCode(email);
         res.status(200).json({ message: `Verification code sent to your email`, email });
      } catch(error: any) {
         if (error instanceof InternalServerError) {
            res.status(500).json({ error: error.message }); 
         } else {
            res.status(501).json({ error: error.message });
         }   
      }
   }

   async login(req: Request, res: Response) {
      const { email, password } = req.body;
      try {
         const { accessToken, refreshToken, userInfo } = await authService.login(email, password);

         const isMobleClient = req.headers['user-agent'] && req.headers['user-agent'].includes('Mobile');
         if (isMobleClient) { 
            res.status(200).json({ accessToken, refreshToken, userInfo });
         } else {
            res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });
            res.status(200).json({ accessToken, userInfo });
         }
      } catch(error: any) {
         if (error instanceof UserNotFoundError) {
            res.status(404).json({ error: error.message });
         } else if (error instanceof UserAccountIsNotActivatedError) {
            res.status(403).json({ error: error.message }); 
         } else if (error instanceof IncorrectPasswordError) {
            res.status(401).json({ error: error.message });
         } else if (error instanceof InternalServerError) {
            res.status(500).json({ error: error.message });
         } else {
            res.status(501).json({ error: error.message });
         }
      }
   } 

   async logout(req: Request, res: Response) {
      const { authorizedUser: { id } } = req.body;

      try {
         await authService.logout(id);
         res.clearCookie('refreshToken', { httpOnly: true, secure: true });
         res.status(200).json({ message: "Logout successful" });
      } catch (error: any) {
         if (error instanceof NotAuthorizedError) {
            res.status(401).json({ error: error.message });
         } else if (error instanceof InternalServerError) {
            res.status(500).json({ error: error.message });
         } else {
            res.status(501).json({ error: error.message });
         }
      }
   }

   async refreshAccessToken(req: Request, res: Response) {
      const refreshToken = req.cookies.refreshToken || req.query.refreshToken;
      if (!refreshToken) return res.status(400).json({ error: "Refresh token is required" });
      try {
         const newAccessToken = await authService.refreshAccessToken(refreshToken);
         res.status(200).json({ message: "new access token generated successfuly", newAccessToken });
      } catch(error: any) {
         if (error instanceof InvalidTokenError) {
            res.status(401).json({ error: error.message });
         } else if (error instanceof TokenExpiredError) {
            res.status(409).json({ error: error.message });
         } else if(error instanceof InternalServerError) {
            res.status(500).json({ error: error.message });
         } else {
            res.status(501).json({ error: error.message });  
         }
      }
   }

   async forgotPassword(req: Request, res: Response) {
      const { email } = req.body;
      try {
         await authService.forgotPasswordCode(email);
         res.status(200).json({ message: `Token sent to your email: ${email}` });
      } catch (error: any) {
         if (error instanceof UserNotFoundError) {
            res.status(404).json({ error: error.message });
         } else if (error instanceof InternalServerError) {
            res.status(500).json({ error: error.message });
         } else {
            res.status(501).json({ error: error.message });  
         }
      }
   }

   async resetPassword(req: Request, res: Response) {
      const { newPassword, sendedToken } = req.body;
      try {
         await authService.resetPassword(newPassword, sendedToken);
         res.status(200).json({ message: "Password has successfully changed" });
      } catch(error: any) {
         if (error instanceof InvalidTokenError) {
            res.status(401).json({ error: error.message });
         } else if (error instanceof InternalServerError) {
            res.status(500).json({ error: error.message });  
         } else {
            res.status(501).json({ error: error.message });  
         }
      }
   }
 
   async changePassword(req: Request, res: Response) {
      const { authorizedUser: { id }, oldPassword, newPassword } = req.body;
      try {
         await authService.changePassword(id, oldPassword, newPassword);
         res.status(200).json({ message: "Password has successfully changed" });
      } catch(error: any) {
         if (error instanceof UserNotFoundError) {
            res.status(404).json({ error: error.message });
         } else if (error instanceof IncorrectPasswordError) {
            res.status(401).json({ error: error.message });  
         } else if (error instanceof InternalServerError) {
            res.status(500).json({ error: error.message });  
         } else {
            res.status(501).json({ error: error.message });  
         }
      }
   }
}
  
export default new AuthController;