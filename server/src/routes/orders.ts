import { Router } from 'express';
import * as orderController from '../controllers/orders';

const router = Router();

router.post('/', orderController.createOrder);
router.get('/', orderController.getAllOrders);

export default router;
