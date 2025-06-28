const express = require ('express');
const router = express.Router();
const protect = require('../middlewares/authMiddlewares');

const   {crearProducto, obtenerProductos, actualizarProducto, eliminarProducto } = require('../controllers/productsControllers');

router.post('/', protect, crearProducto);
router.get('/', protect, obtenerProductos);
router.put('/:id', protect, actualizarProducto);
router.delete('/:id', protect, eliminarProducto);

module.exports = router;