const express = require('express');
const router = express.Router();
const { protect, isPremium } = require('../middleware/authMiddleware');
const {
  generateFinancialAnalysis,
  getExistingAnalysis,
  exportToPDF,
} = require('../controllers/reportsController');

// Rutas protegidas (requieren autenticación)
router.post('/generate', protect, generateFinancialAnalysis);
router.get('/current', protect, getExistingAnalysis);

// Rutas premium (requieren plan premium)
router.get('/export/pdf', protect, isPremium, exportToPDF);

module.exports = router;
