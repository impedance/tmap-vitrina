import { Router } from 'express';
import * as productController from '../controllers/products';
import multer from 'multer';
import path from 'path';

const router = Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/', upload.fields([
    { name: 'images', maxCount: 10 },
    { name: 'files', maxCount: 5 }
]), productController.createProduct);
router.put('/:id', upload.fields([
    { name: 'images', maxCount: 10 },
    { name: 'files', maxCount: 5 }
]), productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

export default router;
