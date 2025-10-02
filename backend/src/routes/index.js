const express = require('express');
const authRoutes = require('./auth');
const simulationsRoutes = require('./simulations');
const paymentsRoutes = require('./payments');
const reportsRoutes = require('./reports');

const router = express.Router();

// Configurar rutas principales
router.use('/auth', authRoutes);
router.use('/simulations', simulationsRoutes);
router.use('/payments', paymentsRoutes);
router.use('/reports', reportsRoutes);

// Ruta de salud del API
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'EdooConnect API funcionando correctamente',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

module.exports = router;
