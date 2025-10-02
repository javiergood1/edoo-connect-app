const { Sequelize } = require('sequelize');
require('dotenv').config();

// Configuración de la conexión a la base de datos
const sequelize = new Sequelize(
  process.env.DATABASE_URL || 'postgresql://edoouser:edoopass123@localhost:5432/edooconnect',
  {
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'production' ? false : console.log,
    pool: {
      max: process.env.NODE_ENV === 'production' ? 10 : 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      timestamps: true,
      underscored: true,
    },
    dialectOptions: process.env.NODE_ENV === 'production' ? {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    } : {},
  }
);

// Función para probar la conexión
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a PostgreSQL establecida correctamente.');
  } catch (error) {
    console.error('❌ Error al conectar con PostgreSQL:', error);
  }
};

module.exports = { sequelize, testConnection };
