import express from "express";
import cors from "cors";
import router from './routes/index.js';

const app = express();

app.use(cors({
    origin: 'http://localhost:5173'
}));

app.use(express.json());

app.use('/', router);

app.listen(3000, () => {
    console.log('Serviço rodando na porta 3000');
});


