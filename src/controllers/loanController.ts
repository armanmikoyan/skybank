import loanService from "../services/loanService";
import InternalServerError from "../errors/internalErrors"
import { Request, Response } from "express";
import { UserNotFoundError } from "../errors/authErrors";
import { LoanI, allLoanTypes } from "../interfaces/loanInterface";

class LoanController { 
   async loan(req: Request, res: Response) { 
      const { authorizedUser: { id: userId }, amount, currency } = req.body;
      const type: allLoanTypes = req.params.type as allLoanTypes

      try {
         await loanService.loan(userId, type, amount, currency);
         res.status(200).json({ message: "Request for a loan was sent"});
      } catch(error: any) {
         if (error instanceof UserNotFoundError) {
            res.status(404).json({ error: error.message })
         } else if (error instanceof InternalServerError) {
            res.status(500).json({ error: error.message });
         } else {
            res.status(501).json({ error: error.message });
         }
      }
   }

   async getAllLoans(req: Request, res: Response) {
      const defaultLoanCount: number = Infinity;

      const { authorizedUser: { id: userId } } = req.body;
      const countQuery = Number(req.query.count as string);
      const count = (isNaN(countQuery) || countQuery <= 0) ? defaultLoanCount : countQuery;
      try {
         const loans: LoanI[] = await loanService.getLoans(userId, count);
         res.status(200).json(loans);
      } catch (error: any) {
         if (error instanceof UserNotFoundError) {
            res.status(404).json({ error: error.message })
         } else if (error instanceof InternalServerError) {
            res.status(500).json({ error: error.message });
         } else {
            res.status(501).json({ error: error.message });
         }
      }
   }
};

export default new LoanController;
