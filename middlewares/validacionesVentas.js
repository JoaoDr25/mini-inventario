const mongoose = require('mongoose');
const Cliente = require('../models/dataClients');
const Producto = require('../models/dataProducts');

const validarObjectId = (paramName) => (req, res, next) => {
    const id = req.params[paramName];
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ mensaje: `ID ${paramName} no es válido` });
    }
    next();
}

const validarClienteExiste = async (req, res, next) => {
    try {
        const { cliente } = req.body;
    if (!mongoose.Types.ObjectId.isValid(cliente)) {
        return res.status(400).json({ mensaje: 'ID del cliente no es válido' });
    }
    const clienteExiste = await Cliente.findById(cliente);
    if (!clienteExiste) {
        return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    }
    next();
    } catch (error) {
        return res.status(500).json({ mensaje: 'Error al validar cliente', error });
    }
};

const validarProductosArray = async (req, res, next) => {
    const { productos } = req.body;

    if (!Array.isArray(productos) || productos.length === 0) {
        return res.status(400).json({ mensaje: 'Debes agregar al menos un producto' });
    }

    for (const item of productos) {
        if (!mongoose.Types.ObjectId.isValid(item.producto)) {
            return res.status(400).json({ mensaje: 'ID del producto no válido' });
        }

        if (item.cantidad <= 0) {
            return res.status(400).json({ mensaje: 'La cantidad debe ser mayor a cero' });
        }

        const producto = await Producto.findById(item.producto);
        if (!producto) {
            return res.status(400).json({ mensaje: `Producto con ID ${item.producto} no encontrado` });
        }

        if (producto.stock < item.cantidad) {
            return res.status(400).json({ mensaje: `Stock insuficiente para el producto ${producto.nombre}. Disponible ${producto.stock}` });
        }
    }

    next();
};

module.exports = {
    validarObjectId,
    validarClienteExiste,
    validarProductosArray
};



