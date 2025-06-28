require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/dataDb.js');
const authRoutes = require('./routes/authRoutes.js');
const clientsRoutes = require('./routes/clientsRoutes.js');
const productsRoutes = require('./routes/productsRoutes.js');
const ventasRoutes = require('./routes/ventasRoutes.js');

const app = express();


app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/clientes', clientsRoutes);
app.use('/api/productos', productsRoutes);
app.use('/api/ventas', ventasRoutes);

connectDB();


app.get('/', (req, res) => {
  res.send('¡Bienvenido al sistema de inventario!');
});


const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
