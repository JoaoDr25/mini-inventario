const Venta = require('../models/dataVentas');
const Producto = require('../models/dataProducts');

const crearVenta = async (req, res) => {
    try {
        const { cliente, productos } = req.body;

        if (!productos || productos.length === 0) {
            return res.status(400).json({ mensaje: 'Debes agregar al menos un producto'});
        }

        let total = 0;
        productos.forEach( p => {
            total += p.precioUnitario * p.cantidad;
        });

        const nuevaVenta = new Venta({
            cliente,
            productos,
            total
        });

        const ventaGuardada = await nuevaVenta.save();

        res.status(201).json(ventaGuardada);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al registrar la venta', error});
    }
};


const obtenerVentas = async (req, res) => {
    try {
        const ventas = await Venta.find()
        .populate('cliente', 'nombre correo')
        .populate('productos.producto', 'nombre precio categoria');

        res.status(200).json(ventas);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener las ventas', error});
    }
};


module.exports = {
    crearVenta,
    obtenerVentas
};