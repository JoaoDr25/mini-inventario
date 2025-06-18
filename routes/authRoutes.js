const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/authControllers');
const protect = require('../middlewares/authMiddlewares');

router.post('/register', authCtrl.registrar);
router.post('/login', authCtrl.login);

router.get('/perfil', protect, (req, res) => {
    res.json({ message: 'Acceso permitido. Bienvenido a tu perfil.', user: req.user});
});

module.exports = router;
