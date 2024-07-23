import { Router } from 'express';
import { createOrder, orderRouteValidator } from '../controllers/order.controller';

const router = Router();
router.post('/order', orderRouteValidator, createOrder);

export default router;
