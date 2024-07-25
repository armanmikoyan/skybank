import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import swaggerSpecs from "./src/swagger/swaggerConfig";
import swaggerUi from "swagger-ui-express";
import { corsOptions } from "./src/utils/corsConfig"; 
import { authRouter } from "./src/routes/authRouter";
import { cardsRouter } from "./src/routes/cardsRouter";
import { accountsRouter } from "./src/routes/accountsRouter";
import { historyRouter } from "./src/routes/historyRouter";
import { mongoDbStart } from "./src/dataBase/mongo";

const PORT = process.env.PORT || 6666;
mongoDbStart();
 
const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(cors(corsOptions));

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
app.use("/api/auth", authRouter);
app.use("/api/cards", cardsRouter);
app.use("/api/accounts", accountsRouter);
app.use("/api/history", historyRouter);

app.listen(PORT, () => {
   console.log(`Server is running on Port ${PORT}`);
});

