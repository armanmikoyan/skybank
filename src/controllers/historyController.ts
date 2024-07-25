import { Request, Response } from "express";
import { TransactionType } from "../interfaces/transactions/transactionInterface";
import { Transfer }  from "../services/transactions/transfer/transferService"
import { UserNotFoundError } from "../errors/authErrors";
import { InvalidTransactionType } from "../errors/transactionErrors"
import { TransferMongoDodumentI } from "../interfaces/transactions/transferInterface"
import { FilterI, Currency } from "../interfaces/transactions/transactionInterface"
import InternalServerError from "../errors/internalErrors";

class HistoryController {

   private defaultTransactionCount: number = Infinity;

   constructor() {
      this.fetchTransactions = this.fetchTransactions.bind(this);
   }

   async fetchTransactions(req: Request, res: Response) { 
      const { authorizedUser: { id } } = req.body;
      let data: any | TransferMongoDodumentI;
      const { type } = req.params;
      const filters = this.parseQuery(req);
    
      try {
         switch (type.toLocaleUpperCase()) {
               case TransactionType.TRANSFER:
               data = await Transfer.getTransfers(id, filters);
                  break;     
               case TransactionType.WITHDRAW:
                  data = await Transfer.getWithdraws(id, filters);
                  break;              
               case TransactionType.DEPOSIT:
                  data = await Transfer.getDeposits(id, filters);
                  break;              
               case TransactionType.PAYMENT:
                  data = await Transfer.getPayments(id, filters);        
                  break;
               default:
                 throw new InvalidTransactionType;
         }  
         res.status(200).json(data);
      } catch(error: any) {
         if (error instanceof UserNotFoundError || error instanceof InvalidTransactionType) {
            res.status(404).json({ error: error.message });
         } else if (error instanceof InternalServerError) {
            res.status(500).json({ error: error.message });
         } else {
            res.status(501).json({ error: error.message });
         }
      }
   }; 

   private isValidDate(dateString: string) {
      const date = new Date(dateString);
      return !isNaN(date.getTime());
  };

  private parseQuery(req: Request): FilterI {
      const countQuery = Number(req.query.count as string);
         const count = (isNaN(countQuery) || countQuery <= 0) ? this.defaultTransactionCount : countQuery;
         const { 
            creditCurrency, 
            debitCurrency, 
            before_date,
            after_date, 
            creditMaxAmount, 
            creditMinAmount, 
            debitMaxAmount, 
            debitMinAmount 
         } = req.query;

         const filters: FilterI = {
            creditCurrency: creditCurrency ? Currency[(creditCurrency as string).toUpperCase() as Currency] : null,
            debitCurrency: debitCurrency ? Currency[(debitCurrency as string).toUpperCase() as Currency] : null,
            creditMaxAmount: Number(creditMaxAmount) || Infinity,
            creditMinAmount: Number(creditMinAmount) || -Infinity,
            debitMaxAmount: Number(debitMaxAmount) || Infinity,
            debitMinAmount: Number(debitMinAmount) || -Infinity,
            before_date: this.isValidDate(before_date as string) ? new Date(before_date as string) : null,
            after_date: this.isValidDate(after_date as string) ? new Date(after_date as string) : null,
            count
      }
      return filters
  }

};

export default new HistoryController;
