const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Middleware para proteger rutas - Prompt 3.3
const protect = async (req, res, next) => {
  try {
    let token;

    // Extraer token del header Authorization
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Verificar si el token existe
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token de acceso requerido',
      });
    }

    // Verificar y decodificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');

    // Buscar el usuario y adjuntarlo al request
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido - usuario no encontrado',
      });
    }

    // Adjuntar usuario al objeto request
    req.user = user;
    next();
  } catch (error) {
    console.error('Error en middleware de autenticación:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token inválido',
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
    });
  }
};

// Middleware para verificar plan premium
const isPremium = (req, res, next) => {
  try {
    // Verificar que el middleware protect se haya ejecutado antes
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado',
      });
    }

    // Verificar si el usuario tiene plan premium
    if (!req.user.is_premium) {
      return res.status(403).json({
        success: false,
        message: 'Acceso denegado - Plan premium requerido',
        upgrade_required: true,
      });
    }

    next();
  } catch (error) {
    console.error('Error en middleware premium:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
    });
  }
};

module.exports = {
  protect,
  isPremium,
};
