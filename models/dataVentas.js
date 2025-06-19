const mongoose = require('mongoose');

const ventasSchema = new mongoose.Schema ({
    cliente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cliente',
        required: true
    },
    productos : [
        {
            producto: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Producto',
                required: true
            }
            
        }
    ]
})