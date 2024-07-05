import { CorsOptions } from "cors";

export const corsOptions: CorsOptions = {
   origin: true, 
   methods: "*", 
   allowedHeaders: ['Content-Type', 'Authorization'], 
   credentials: true, 
};