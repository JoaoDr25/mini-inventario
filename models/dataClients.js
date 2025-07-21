const mongoose = require('mongoose');

const clienteSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        minlength: [3, 'El nombre debe tener al menos 3 caracteres'],
        trim: true
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true,
        match: [/\S+@\S+\.\S+/, 'Correo inválido']
    },
    telefono: {
        type: String,
        minlength: 7,
        maxlength: 15
    },
    direccion: {
        type: String,
        required: [true, 'La dirección es obligatoria'],
        minlength: [5, 'La dirección debe tener al menos 5 caracteres'],
        trim: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Cliente', clienteSchema);