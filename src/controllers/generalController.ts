import { Request, Response } from "express";
import { Currency } from "../interfaces/transactions/transactionInterface"
import { allLoanTypes } from "../interfaces/loanInterface";
import { allDepositTypes } from "../interfaces/depositInterface";

class GeneralController {

   async allCurrencies(req: Request, res: Response) {
      try {
         res.status(200).json(Currency);
      } catch(error: any) {
         res.status(501).json({ error: error.message });
      }
   }

   async allLoanTypes(req: Request, res: Response) {
      try {
         res.status(200).json(allLoanTypes)
      } catch(error: any) {
         res.status(501).json({ error: error.message });
      }
   }

   async allDepositTypes(req: Request, res: Response) {
      try {
         res.status(200).json(allDepositTypes)
      } catch(error: any) {
         res.status(501).json({ error: error.message });
      }
   }
};

export default new GeneralController;