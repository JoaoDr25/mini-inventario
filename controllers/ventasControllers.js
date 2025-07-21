const mongoose = require('mongoose');
const ExcelJS = require('exceljs');

const Venta = require('../models/dataVentas');
const Producto = require('../models/dataProducts');
const Cliente = require('../models/dataClients');

const crearVenta = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { cliente, productos } = req.body;

        if (!productos || productos.length === 0) {
            await session.abortTransaction();
            return res.status(400).json({ mensaje: 'Debes agregar al menos un producto' });
        }

        let total = 0;
        for (const item of productos) {
            const producto = await Producto.findById(item.producto).session(session);
            if (!producto) {
                await session.abortTransaction();
                return res.status(404).json({ mensaje: `Producto con ID ${item.producto} no encontrado` });
            }

            total += item.cantidad * producto.precio;
        }

        const nuevaVenta = new Venta({ cliente, productos, total });
        await nuevaVenta.save({ session });

        for (const item of productos) {
            await Producto.findByIdAndUpdate(
                item.producto,
                { $inc: { stock: -item.cantidad } },
                { session }
            );
        }

        await session.commitTransaction();
        res.status(201).json({ mensaje: 'Venta registrada exitosamente', venta: nuevaVenta });

    } catch (error) {
        await session.abortTransaction();
        res.status(500).json({ mensaje: 'Error al registrar la venta', error });
    } finally {
        session.endSession();
    }
};


const obtenerVentas = async (req, res) => {
    try {
        const {
            cliente,
            fechaInicio,
            fechaFin,
            producto,
            totalMin,
            totalMax,
            page = 1,
            limit = 10,
            sort = 'createdAt',
            order = 'desc' 
        } = req.query;

        const filtros = {};

        if (cliente) filtros.cliente = cliente;

        if (fechaInicio || fechaFin) {
            filtros.createdAt = {};
            if (fechaInicio) filtros.createdAt.$gte = new Date(fechaInicio);
            if (fechaFin) filtros.createdAt.$lte = new Date(fechaFin);
        }

        if (producto) filtros['productos.producto'] = producto;

        if (totalMin || totalMax) {
            filtros.total = {};
            if (totalMin) filtros.total.$gte = Number(totalMin);
            if (totalMax) filtros.total.$lte = Number(totalMax);
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const orden = order === 'asc' ? 1 : -1;

        const [ventas, totalRegistros] = await Promise.all([
            Venta.find(filtros)
                .populate('cliente', 'nombre correo')
                .populate('productos.producto', 'nombre precio categoria')
                .sort({ [sort]: orden })  // Ej: { total: -1 }
                .skip(skip)
                .limit(parseInt(limit)),

            Venta.countDocuments(filtros)
        ]);

        res.status(200).json({
            totalRegistros,
            paginaActual: parseInt(page),
            totalPaginas: Math.ceil(totalRegistros / limit),
            ventas
        });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener ventas con filtros y paginación', error });
    }
};


const actualizarVenta = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { id } = req.params;
        const { cliente, productos } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            await session.abortTransaction();
            return res.status(400).json({ mensaje: 'ID de venta no válido' });
        }

        const ventaExistente = await Venta.findById(id).session(session);
        if (!ventaExistente) {
            await session.abortTransaction();
            return res.status(404).json({ mensaje: 'Venta no encontrada' });
        }

        for (const item of ventaExistente.productos) {
            await Producto.findByIdAndUpdate(
                item.producto,
                { $inc: { stock: item.cantidad } },
                { session }
            );
        }

        let total = 0;
        const productosValidados = [];

        for (const item of productos) {
            const producto = await Producto.findById(item.producto).session(session);
            if (!producto) {
                await session.abortTransaction();
                return res.status(404).json({ mensaje: `Producto con ID ${item.producto} no encontrado` });
            }

            total += item.cantidad * producto.precio;

            productosValidados.push({
                producto: producto._id,
                cantidad: item.cantidad,
                precioUnitario: producto.precio,
            });

            producto.stock -= item.cantidad;
            await producto.save({ session });
        }

        ventaExistente.cliente = cliente;
        ventaExistente.productos = productosValidados;
        ventaExistente.total = total;

        const ventaActualizada = await ventaExistente.save({ session });

        await session.commitTransaction();
        res.status(200).json(ventaActualizada);
    } catch (error) {
        await session.abortTransaction();
        res.status(500).json({ mensaje: 'Error al actualizar la venta', error });
    } finally {
        session.endSession();
    }
};


const eliminarVenta = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            await session.abortTransaction();
            return res.status(400).json({ mensaje: 'ID de venta no válido' });
        }

        const venta = await Venta.findById(id).session(session);
        if (!venta) {
            await session.abortTransaction();
            return res.status(404).json({ mensaje: 'Venta no encontrada' });
        }

        for (const item of venta.productos) {
            await Producto.findByIdAndUpdate(
                item.producto,
                { $inc: { stock: item.cantidad } },
                { session }
            );
        }

        await Venta.findByIdAndDelete(id).session(session);

        await session.commitTransaction();
        res.status(200).json({ mensaje: 'Venta eliminada correctamente' });
    } catch (error) {
        await session.abortTransaction();
        res.status(500).json({ mensaje: 'Error al eliminar la venta', error });
    } finally {
        session.endSession();
    }
};

const exportarVentasExcel = async (req, res) => {
    try {
        const {
            cliente,
            fechaInicio,
            fechaFin,
            producto,
            totalMin,
            totalMax
        } = req.query;

        const filtros = {};

        if (cliente) filtros.cliente = cliente;

        if (fechaInicio || fechaFin) {
            filtros.createdAt = {};
            if (fechaInicio) filtros.createdAt.$gte = new Date(fechaInicio);
            if (fechaFin) filtros.createdAt.$lte = new Date(fechaFin);
        }

        if (producto) filtros['productos.producto'] = producto;

        if (totalMin || totalMax) {
            filtros.total = {};
            if (totalMin) filtros.total.$gte = Number(totalMin);
            if (totalMax) filtros.total.$lte = Number(totalMax);
        }

        const ventas = await Venta.find(filtros)
            .populate('cliente', 'nombre correo')
            .populate('productos.producto', 'nombre precio categoria');

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Ventas');

        worksheet.columns = [
            { header: 'ID Venta', key: '_id', width: 24 },
            { header: 'Cliente', key: 'cliente', width: 20 },
            { header: 'Correo', key: 'correo', width: 25 },
            { header: 'Producto(s)', key: 'productos', width: 40 },
            { header: 'Total', key: 'total', width: 15 },
            { header: 'Fecha', key: 'fecha', width: 20 },
        ];

        ventas.forEach((venta) => {
            worksheet.addRow({
                _id: venta._id.toString(),
                cliente: venta.cliente?.nombre || 'Sin nombre',
                correo: venta.cliente?.correo || 'Sin correo',
                productos: venta.productos.map(p => `${p.producto?.nombre} (x${p.cantidad})`).join(', '),
                total: venta.total,
                fecha: venta.createdAt.toLocaleString(),
            });
        });

        worksheet.getRow(1).eachCell(cell => {
            cell.font = { bold: true };
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=ventas.xlsx');

        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        res.status(500).json({ mensaje: 'Error al exportar las ventas', error });
    }
};


module.exports = {
    crearVenta,
    obtenerVentas,
    actualizarVenta,
    eliminarVenta,
    exportarVentasExcel
};
