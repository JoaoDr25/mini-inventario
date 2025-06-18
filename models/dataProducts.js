const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        require: true,
        trim: true
    },
    categoria: {
        type: String,
        require: true
    },
    precio: {
        type: Number,
        require: true
    },
    stock: {
        type: Number,
        require: true
    },
    descripcion: {
        type: String,
        default: ''
    },
    codigo: {
        type: String,
        unique: true
    }
},{
    timestamps: true
});

module.exports = mongoose.model('Producto', productoSchema);