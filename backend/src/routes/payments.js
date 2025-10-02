const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createCheckoutSession,
  verifyPayment,
  handleWebhook,
  getUserPlan,
} = require('../controllers/paymentsController');

// Rutas protegidas (requieren autenticación)
router.post('/create-checkout-session', protect, createCheckoutSession);
router.get('/verify/:session_id', protect, verifyPayment);
router.get('/plan', protect, getUserPlan);

// Webhook de Stripe (no requiere autenticación, pero sí verificación de firma)
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

module.exports = router;
