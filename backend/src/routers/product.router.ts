import { Router } from "express";
import {
  createProduct,
  getProducts,
  productRouteValidator,
} from "../controllers/product.controller";

const router = Router();
router.get("/product", getProducts);
router.post("/product", productRouteValidator, createProduct);

export default router;
