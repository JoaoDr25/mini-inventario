const express = require('express');
const router = express.Router();
const protect = require('../middlewares/authMiddlewares');

const { crearVenta, obtenerVentas } = require('../controllers/ventasControllers');

router.post('/', protect, crearVenta);
router.get('/', protect, obtenerVentas);

module.exports = router;