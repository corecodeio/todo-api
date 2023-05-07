import { Router } from 'express';
const router = Router();

router.get('/health', (_, res) => {
  res.send('OK');
});

export default router;
