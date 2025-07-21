const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre del producto es obligatorio'],
        unique: true,
        minlength: 3,
        trim: true
    },
    categoria: {
        type: String,
        required: [true, 'La categoria es obligatoria'],
        enum: ['Electrónica', 'Ropa', 'Alimentos', 'Hogar', 'Otros'],
        trim: true
    },
    precio: {
        type: Number,
        required: [true, 'El precio es obligatorio'],
        min: [0.01, 'El precio debe ser mayor a 0']
    },
    stock: {
        type: Number,
        required: true,
        min: [0, 'El stock no puede ser negativo'],
        default: 0
    },
    descripcion: {
        type: String,
        default: '',
        trim: true
    },
    codigo: {
        type: String,
        required: [true, 'El codigo del producto es obligatorio'],
        unique: true,
        minlength: [3, 'El código debe tener al menos 3 caracteres'],
        maxlength: [20, 'El código no debe exceder 20 caracteres'],
        trim: true,
        match: [/^[a-zA-Z0-9\-]+$/, 'El código solo puede contener letras, números y guines']
    }
}, {
    timestamps: true
});

productoSchema.index({ categoria: 1 });

module.exports = mongoose.model('Producto', productoSchema);