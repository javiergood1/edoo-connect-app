const express = require('express');
const {
  saveWizardData,
  getCurrentSimulation,
  getUserSimulations,
  getSimulationById,
} = require('../controllers/simulationsController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Todas las rutas de simulaciones requieren autenticación
router.use(protect);

// Rutas del wizard y simulaciones
router.post('/', saveWizardData);                    // POST /api/simulations - Guardar datos del wizard
router.get('/current', getCurrentSimulation);        // GET /api/simulations/current - Obtener simulación actual
router.get('/', getUserSimulations);                 // GET /api/simulations - Obtener todas las simulaciones del usuario
router.get('/:id', getSimulationById);              // GET /api/simulations/:id - Obtener simulación específica

module.exports = router;
