const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importar configuración de base de datos y modelos
const { sequelize, testConnection } = require('./src/config/database');
require('./src/models'); // Esto carga los modelos y sus relaciones

// Importar rutas
const apiRoutes = require('./src/routes');

const app = express();

// Middlewares
app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

// Ruta de prueba principal
app.get('/', (req, res) => {
  res.json({ 
    message: 'Bienvenido a EdooConnect API',
    version: '1.0.0',
    status: 'active',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      simulations: '/api/simulations',
    },
  });
});

// Rutas del API
app.use('/api', apiRoutes);

// Middleware para manejar rutas no encontradas
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint no encontrado',
  });
});

// Middleware global de manejo de errores
app.use((error, req, res, next) => {
  console.error('Error no manejado:', error);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
  });
});

// Función para inicializar la base de datos
const initializeDatabase = async () => {
  try {
    await testConnection();
    
    // Sincronizar modelos con la base de datos
    await sequelize.sync({ alter: true });
    console.log('✅ Modelos sincronizados con la base de datos');
  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error);
  }
};

// Inicializar base de datos al cargar la aplicación
initializeDatabase();

module.exports = app;
