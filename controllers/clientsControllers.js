const Cliente = require('../models/dataClients');

const crearCliente = async (req, res) => {
    try {
        const nuevoCliente = new Cliente(req.body);
        const clienteGuardado = await nuevoCliente.save();
        res.status(201).json(clienteGuardado);
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al crear cliente', error});
    }
};

const obtenerClientes = async (req, res) => {
    try {
        const clientes = await Cliente.find();
        res.status(200).json(clientes);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener clientes', error})
    }
};

const actualizarCliente = async (req, res) => {
    try {
        const clienteActualizado = await Cliente.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true}
        );
        if (!clienteActualizado) {
            return res.status(404).json({ mensaje: 'Cliente no encontrado' });
        }
        res.status(200).json(clienteActualizado);

    } catch (error) {
        res.status(400).json({ mensaje: 'Error al actualizar cliente', error});
    }
};

const eliminarCliente = async (req, res) => {
    try {
        const clienteEliminado = await Cliente.findByIdAndDelete(
            req.params.id
        );
        if (!clienteEliminado) {
            return res.status(404).json({ mensaje: 'Cliente no encontrado' });
        }
        res.status(200).json({ mensaje: 'Cliente eliminado correctamente' });

    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar cliente'. error});
    }
};

module.exports = {
    crearCliente,
    obtenerClientes,
    actualizarCliente,
    eliminarCliente
};
