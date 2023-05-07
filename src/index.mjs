import cors from 'cors';
import express from 'express';
import { join } from 'path';

import { initDB } from './services/database.mjs';

import health from './middlewares/health.mjs';

import todoRoutes from './routes/todo.mjs';

const port = process.env.APP_ENV || 8000;

const app = express();

app.use(cors());
app.use(health);
app.use(express.json());

const publicPath = join(process.cwd(), 'public');
app.use(express.static(publicPath));

app.use('/api', todoRoutes);

try {
  await initDB();
  app.listen(port, () => {
    console.log(`API running on port ${port}`);
  });
} catch (error) {
  console.error(error);
  process.exit(-1);
}
