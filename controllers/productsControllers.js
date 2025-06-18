const Producto = require('../models/dataProducts');

const crearProducto = async (req, res) => {
    try {
        const nuevoProducto = new Producto(req.body);
        const productoGuardado = await nuevoProducto.save();
        res.status(201).json(productoGuardado);
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al crear el producto', error});
    }
};

const obtenerProductos = async(req, res) => {
    try {
    const productos = await Producto.find();
    res.status(200).json(productos);     
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener los productos', error});
    }
};

const actualizarProducto = async(req, res) => {
   try {
     const productoActualizado = await Producto.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    if (!productoActualizado){
        return res.status(404).json({ mensaje: 'Producto no encontrado'});
    }
    res.status(200).json(productoActualizado);
   } catch (error) {
        res.status(400).json({ mensaje: 'Error al actualizar el producto', error});
   }
};

const eliminarProducto = async(req, res) => {
    try {
        const productoEliminado = await Producto.findByIdAndDelete(req.params.id);
        if (!productoEliminado) {
            return res.status(404).json({ mensaje: 'Producto no encontrado'});
        }
        res.status(200).json({ mensaje: 'Producto eliminado correctamente'});
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al eliminar el producto', error });
    }
};

module.exports = {
    crearProducto,
    obtenerProductos,
    actualizarProducto,
    eliminarProducto
};

