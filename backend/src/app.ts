import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { errorHandler } from './middlewares/error.middleware';
import routes from './routes';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'PadosiPro Backend API', time: new Date().toISOString() });
});

app.use('/api', routes);

app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(process.env.PORT || 5000, () => {
    console.log(`PadosiPro Backend Server running on http://localhost:${process.env.PORT || 5000}`);
  });
}

export default app;
