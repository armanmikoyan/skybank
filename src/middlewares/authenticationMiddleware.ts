import jwt from "jsonwebtoken";
import refreshTokenSchema from "../models/refreshTokenModel";
import { Request, Response, NextFunction } from "express";
import { NotAuthorizedError } from "../errors/authErrors";
import { InvalidTokenError } from "../errors/tokenErrors";

const checkUserAuthentification = (req: Request, res: Response, next: NextFunction) => {
   try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) throw new NotAuthorizedError;
      
      jwt.verify(token, process.env.JWT_SECRET as string, async (err: any, decoded) => {
         if (err) {
            res.status(409).json({ error: new InvalidTokenError().message });
         } else {
            req.body.authorizedUser = decoded;
            const isActiveSession = await refreshTokenSchema.findOne({ userId: req.body.authorizedUser.id });
            if (!isActiveSession) return res.status(401).json({ error: new NotAuthorizedError().message });
            next();
         }
      });
      
   } catch(error: any) {
      if (error instanceof NotAuthorizedError) {
         res.status(403).json({ error: error.message })  
      } else {
         res.status(501).json({ error: error.message })  
      }
   }
};

export default checkUserAuthentification;