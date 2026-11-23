import "dotenv/config";
import express from "express";
import cors from "cors";
import router from "./routes/index.js";

const app = express();

const PORT = Number(process.env.PORT || 3000);
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(cors({
    origin: FRONTEND_URL
}));

app.use(express.json());

app.use("/", router);

app.listen(PORT, () => {
    console.log(`Serviço rodando na porta ${PORT}`);
});


