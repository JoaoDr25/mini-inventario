const express = require('express');
const router = express.Router();
const protect = require('../middlewares/authMiddlewares');
const { crearCliente, obtenerClientes, actualizarCliente, eliminarCliente } = require ('../controllers/clientsControllers');

router.post('/', protect, crearCliente);
router.get('/', protect, obtenerClientes);
router.put('/:id', protect, actualizarCliente);
router.delete('/:id', protect, eliminarCliente);

module.exports = router;