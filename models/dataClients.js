const mongoose = require('mongoose');

const clienteSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    correo: { type: String },
    telefono: { type: String },
    direccion: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model('Cliente', clienteSchema);