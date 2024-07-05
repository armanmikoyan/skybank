import mongoose from "mongoose";
import { mongoMonitoring } from "../utils/monitoringDb"

export const mongoDbStart = async () => {
   try {    
      await mongoose.connect(`${process.env.MONGO_CONNECTION}`);   
      mongoMonitoring(); 
      console.log("Connected to Database\nMonitoring has started");
      
   } catch (error: any) {
      console.log("Error in Database", error.message);
   }
};
