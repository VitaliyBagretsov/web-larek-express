import { Router } from 'express';
import { createProduct, getProducts } from '../controllers/product.controller';

const router = Router();
router.get('/product', getProducts);
router.post('/product', createProduct);

export default router;
