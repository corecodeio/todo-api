import cors from 'cors';
import express from 'express';

import { initDB } from './services/database.mjs';

import todoRoutes from './routes/todo.mjs';

const port = process.env.APP_ENV || 3000;

const app = express();

app.use(cors());
app.use(express.json());

app.use('/to-dos', todoRoutes);

try {
  await initDB();
  app.listen(port, () => {
    console.log(`API running on port ${port}`);
  });
} catch (error) {
  console.error(error);
  process.exit(-1);
}
