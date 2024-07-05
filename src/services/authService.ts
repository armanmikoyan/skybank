import bcrypt from 'bcrypt';
import userSchema from "../models/userModel";
import refreshTokenSchema from "../models/refreshTokenModel";
import verificationCodeSchema from "../models/verificationCodeModel";
import InternalServerError from "../errors/internalErrors"
import jwt, { JwtPayload } from 'jsonwebtoken';
import { UserInterface } from "../interfaces/userInterface";
import { transporter } from "../utils/transportEmail"; 
import { TokenExpiredError, InvalidTokenError } from "../errors/tokenErrors";
import { UserAlreadyExistsError, UserNotFoundError, UserAccountIsNotActivatedError, IncorrectPasswordError, NotAuthorizedError } from "../errors/authErrors";

class AuthService {

   #generateAccessToken(user: any) {
      const payload = {
         id: user._id,
         email: user.email,
         firstName: user.firstName,
         lastName: user.lastName,
         exp: Math.floor(Date.now() / 1000) + (60 * 15),  // expires in 15 min
      };

      return jwt.sign(payload, process.env.JWT_SECRET as string)
   }

   #generateRefreshToken(user: any) {
      const payload = {
        id: user._id,
        email: user.email,
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7)   // for jwt 7 days
      }; 

      const expiresAt = new Date(payload.exp * 1000); // expires in 7 days

      const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET as string);
      return { refreshToken, expiresAt };
   }

   #generateVerificationCode() {
      const min = 1000; 
      const max = 9999; 
      const verificationCode = Math.floor(Math.random() * (max - min + 1)) + min;
      return verificationCode;
    }

   #getMailStructure(code: number, emailToSend: string, subject: string, htmlContent: string) {
      const mailOptions = {
         from: process.env.EMAIL_USER,
         to: emailToSend, 
         subject: subject,
         html: htmlContent,
      };
      return mailOptions;
    }
    
   async #verificationTokenSender(code: number, email: string, expiresAt: Date, subject: string, htmlContent: string) {   
     try {
      
         const existingCode = await verificationCodeSchema.findOne({ email });
         if (existingCode) {
            await verificationCodeSchema.findOneAndUpdate({ email }, { code, expiresAt });
         } else {
            await verificationCodeSchema.create({ email, code , expiresAt });
         }
         await transporter.sendMail(this.#getMailStructure(code, email, subject, htmlContent ));

      } catch (error: any) {
         throw error;
      }
   }

   async deleteExiredRefreshTokens() {
      try {
         const now = new Date();
         await refreshTokenSchema.deleteMany({ expiresAt: { $lt: now } });
      } catch (error: any) {
         throw error;
      }
   }

   async deleteInactiveUsers() {
      try {
        await userSchema.deleteMany({ isVerified: false });
      } catch (error: any) {
        throw error;
      }
   }

   async deleteExpiredVerificationCodes() {
      try {
         const now = new Date();
         await verificationCodeSchema.deleteMany({ expiresAt: { $lt: now } });
      } catch (error: any) {
        throw error;
      }
   }

   async refreshAccessToken(refreshToken: string) {
      try {
         const storedToken = await refreshTokenSchema.findOne({ token: refreshToken });
         if (!storedToken) throw new InvalidTokenError;

         const decodedRefreshToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string) as JwtPayload;
         if (decodedRefreshToken.exp && decodedRefreshToken.exp * 1000 < Date.now()) {
            throw new TokenExpiredError;
         }
         const user = await userSchema.findOne({ email: decodedRefreshToken.email }) as JwtPayload;
         return this.#generateAccessToken(user);

      } catch(error: any) {
         if (error instanceof InvalidTokenError || error instanceof TokenExpiredError) {
            throw error;
         } else {
            throw new InternalServerError(error.message);
         }
      }
   };

   async registration(user: UserInterface) {
      try {
         const userAlreadyExists = await userSchema.findOne({ email: user.email });
         if (userAlreadyExists) throw new UserAlreadyExistsError;
   
         const hashedPassword = await bcrypt.hash(user.password, 10);
         const newUser = new userSchema({
            ...user,
            password: hashedPassword,    
         });
         await newUser.save();  
         await this.emailVeridicationCode(user.email);
      } catch (error: any) {
         if (error instanceof UserAlreadyExistsError) {
            throw error;
         } else {
            throw new InternalServerError(error.message);
         }
      }
   }

   async emailVeridicationCode(email: string) {
      try {
         const expiresAt = new Date(Date.now() + 60 * 1000);   // 1 minute
         const subject = "Email verification";
         const code = this.#generateVerificationCode(); 
         const emailContent = `
         <h1 style="font-family: Arial, sans-serif; font-size: 25px; line-height: 1.6; color: #007bff;">
            Your verification code is: ${code}<br><br>
         </h1>
         `;
         this.#verificationTokenSender(code, email, expiresAt, subject, emailContent);
      } catch (error: any) {
         throw new InternalServerError(error.message);
      }
   }

   async checkCodeAndRegisterUser(code: string) {
      try {
         const storedCode = await verificationCodeSchema.findOne({ code });
         if (storedCode) {
            if (storedCode.expiresAt > new Date()) {
               await userSchema.findOneAndUpdate({ email: storedCode.email }, { isVerified: true });  
            } else {
               throw new TokenExpiredError;
            }
         } else {
            throw new InvalidTokenError;
         }     
      } catch (error: any) {
         if (error instanceof TokenExpiredError || error instanceof InvalidTokenError) {
            throw error;
         } else {
            throw new InternalServerError(error.message);
         }
      } finally {
         await verificationCodeSchema.findOneAndDelete({ code });
      }
   }

   async login(email: string, password: string) {
      try {
         const user = await userSchema.findOne({ email }).lean();
         if (!user) throw new UserNotFoundError;
         if (!user.isVerified) throw new UserAccountIsNotActivatedError;

         const isCorrectPassword = await bcrypt.compare(password, user.password);
         if (!isCorrectPassword) throw new IncorrectPasswordError;

         const accessToken = this.#generateAccessToken(user);
         const {refreshToken , expiresAt} = this.#generateRefreshToken(user);

         const existingToken = await refreshTokenSchema.findOne({ userId: user._id });

         if (existingToken) {
            existingToken.token = refreshToken;
            existingToken.expiresAt = expiresAt
            await existingToken.save();
         } else {
            await refreshTokenSchema.create({ userId: user._id, token: refreshToken, email: user.email, expiresAt });
         }   
  
         const { password: notInclude, ...userInfo } = user;

         return { accessToken, refreshToken, userInfo };
         
      } catch (error: any) {
         if (error instanceof UserNotFoundError || error instanceof UserAccountIsNotActivatedError || error instanceof IncorrectPasswordError) {
            throw error;
         } else {
            throw new InternalServerError(error.message);
         }
      }
   }
   
   async logout(userId: string) {
      try {
         const session = await refreshTokenSchema.findOneAndDelete({ userId });
         if (!session) throw new NotAuthorizedError;

      } catch(error: any) {
         if (error instanceof NotAuthorizedError) {
            throw error;
         } else {
            throw new InternalServerError(error.message);
         }
      }
   }

   async forgotPasswordCode(email: string) {
      try {
         const user = await userSchema.findOne({ email });
         if (!user) throw new UserNotFoundError;
         
         const expiresAt = new Date(Date.now() + 60 * 1000);   // 1 minute
         const subject = "Forgot password";
         const text = "Reset password";
         const endpoint = "reset";
         const code = this.#generateVerificationCode(); 
         const verificationUrl = `${process.env.FRONT_URL}${endpoint}?token=${code}`;
         const emailContent = `
         <p>${text}</p>
         <a href="${verificationUrl}" style="display: inline-block; padding: 10px 20px; 
         margin: 10px 0; font-size: 16px; color: #fff; background-color: #007bff; 
         text-decoration: none; border-radius: 5px;">${text}</a>`;
         this.#verificationTokenSender(code, email, expiresAt, subject, emailContent);

      } catch (error: any) {
         if (error instanceof UserNotFoundError) {
            throw error;
         }
         throw new InternalServerError(error.message);
      }
   }
 
   async resetPassword(newPassword: string, code: string) {
      try {
         const storedCode = await verificationCodeSchema.findOne({ code });
         if (storedCode && storedCode.expiresAt > new Date())
         { 
            const hashedNewPassword = await bcrypt.hash(newPassword, 10);
            await userSchema.findOneAndUpdate({ email: storedCode.email }, { password: hashedNewPassword });  
            await verificationCodeSchema.findOneAndDelete({ code });
         } else {
            await verificationCodeSchema.findOneAndDelete({ code });
            throw new InvalidTokenError;
         }    
      } catch (error: any) {
         if (error instanceof InvalidTokenError) {
            throw error;
         } else {
            throw new InternalServerError(error.message);
         }
      }
   }

   async changePassword(id: string, oldPassword: string, newPassword: string) {
      try {
         const user = await userSchema.findById(id);
         if (!user) throw new UserNotFoundError;
         
         const isCorrectPassword = await bcrypt.compare(oldPassword, user.password);
         if (!isCorrectPassword) throw new IncorrectPasswordError;

         const hashedNewPassword = await bcrypt.hash(newPassword, 10);
         user.password = hashedNewPassword;
         await user.save();

      } catch(error:any) {
         if (error instanceof UserNotFoundError || error instanceof IncorrectPasswordError) {
            throw error;
         } else {
            throw new InternalServerError(error.message);
         }
      }
   }
}

export default new AuthService();