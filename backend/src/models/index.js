const User = require('./User');
const Simulation = require('./Simulation');

// Establecer relaciones entre modelos
// Un usuario puede tener muchas simulaciones
User.hasMany(Simulation, {
  foreignKey: 'user_id',
  as: 'simulations',
});

// Una simulación pertenece a un usuario
Simulation.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});

module.exports = {
  User,
  Simulation,
};
