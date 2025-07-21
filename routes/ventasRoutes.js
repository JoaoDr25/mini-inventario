const express = require('express');
const router = express.Router();
const protect = require('../middlewares/authMiddlewares');

const { crearVenta, obtenerVentas, actualizarVenta, eliminarVenta, exportarVentasExcel } = require('../controllers/ventasControllers');

const { validarObjectId, validarClienteExiste, validarProductosArray } = require('../middlewares/validacionesVentas');

router.post('/', protect, validarClienteExiste, validarProductosArray, crearVenta);
router.get('/', protect, obtenerVentas);
router.put('/:id', protect, validarObjectId('id'), validarClienteExiste, validarProductosArray, actualizarVenta);
router.delete('/:id', protect, validarObjectId('id'), eliminarVenta);
router.get('/exportar/excel', protect, exportarVentasExcel);

module.exports = router;