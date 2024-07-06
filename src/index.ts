import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import swaggerSpecs from "./swagger/swaggerConfig";
import swaggerUi from "swagger-ui-express";
import { corsOptions } from "./utils/corsConfig"; 
import { authRouter } from "./routes/authRouter";
import { cardsRouter } from "./routes/cardsRouter";
import { accountsRouter } from "./routes/accountsRouter";
import { mongoDbStart } from "./dataBase/mongo";

const PORT = process.env.PORT || 6666;
mongoDbStart();

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(cors(corsOptions));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.use("/api/auth", authRouter);
app.use("/api/cards", cardsRouter);
app.use("/api/accounts", accountsRouter);

app.listen(PORT, () => {
   console.log(`Server is running on Port ${PORT}`);
});

