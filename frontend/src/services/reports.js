import api from './api';

// Servicios de reportes y análisis financiero
export const reportsService = {
  // Generar nuevo análisis financiero
  generateAnalysis: () => api.post('/reports/generate'),
  
  // Obtener análisis existente
  getCurrentAnalysis: () => api.get('/reports/current'),
  
  // Exportar análisis a PDF (solo premium)
  exportToPDF: () => api.get('/reports/export/pdf'),
};

export default reportsService;
