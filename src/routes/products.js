const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const ProductController = require('../controllers/ProductController');

// GET /products - list all products (auth required)
router.get('/', authenticateToken, ProductController.getAll);

// POST /products - create a product (auth required)
router.post('/', authenticateToken, ProductController.create);


// POST /products/reset-stock - reseta o estoque dos produtos (sem autenticação para facilitar uso em teste)
router.post('/reset-stock', ProductController.resetStock);

module.exports = router;
