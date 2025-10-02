import api from './api';

// Servicios de pagos
export const paymentsService = {
  // Crear sesión de checkout para plan premium
  createCheckoutSession: () => api.post('/payments/create-checkout-session'),
  
  // Verificar estado del pago
  verifyPayment: (sessionId) => api.get(`/payments/verify/${sessionId}`),
  
  // Obtener información del plan del usuario
  getUserPlan: () => api.get('/payments/plan'),
};

export default paymentsService;
