import { Router } from 'express';
import { processCharge, type SnailPayConfig } from './snailpay.service';

export function createSnailPayRouter(config: SnailPayConfig) {
  const router = Router();

  router.post('/charges', async (req, res) => {
    const result = await processCharge(req.body, config);
    res.status(result.httpStatus).json(result.body);
  });

  return router;
}
