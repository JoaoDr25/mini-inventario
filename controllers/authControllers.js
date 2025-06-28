const jwt = require('jsonwebtoken');
const User = require('../models/dataUsers');

const generarToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, { expiresIn: '1d'});
};

exports.registrar = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = new User ({username, password});
        await user.save();
        res.status(201).json({message: 'Usuario registrado correctamente'});

    } catch (error) {
        res.status(400).json({message: 'Error al registrar', error});
    }
}

exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne ({ username });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }
        const token = generarToken(user._id);
        res.json({ token });

    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).json({ message: 'Error al iniciar sesión', error });
    }
};
