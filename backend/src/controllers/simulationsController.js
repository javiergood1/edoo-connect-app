const { Simulation, User } = require('../models');

// Crear/Actualizar simulación - Prompt 4.1
const saveWizardData = async (req, res) => {
  try {
    const userId = req.user.id;
    const wizardData = req.body;

    // Buscar simulación en progreso para el usuario
    let simulation = await Simulation.findOne({
      where: {
        user_id: userId,
        status: 'in_progress',
      },
    });

    if (simulation) {
      // Fusionar datos existentes con los nuevos
      const updatedWizardData = {
        ...simulation.wizard_data,
        ...wizardData,
      };

      // Actualizar simulación existente
      simulation = await simulation.update({
        wizard_data: updatedWizardData,
      });
    } else {
      // Crear nueva simulación
      simulation = await Simulation.create({
        user_id: userId,
        wizard_data: wizardData,
        status: 'in_progress',
      });
    }

    res.json({
      success: true,
      message: 'Datos del wizard guardados exitosamente',
      data: {
        simulation: {
          id: simulation.id,
          wizard_data: simulation.wizard_data,
          status: simulation.status,
          created_at: simulation.created_at,
          updated_at: simulation.updated_at,
        },
      },
    });
  } catch (error) {
    console.error('Error al guardar datos del wizard:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
    });
  }
};

// Obtener simulación actual - Prompt 4.2
const getCurrentSimulation = async (req, res) => {
  try {
    const userId = req.user.id;

    // Buscar la última simulación del usuario
    const simulation = await Simulation.findOne({
      where: {
        user_id: userId,
      },
      order: [['updated_at', 'DESC']],
    });

    if (!simulation) {
      return res.status(204).json({
        success: true,
        message: 'No hay simulaciones disponibles',
        data: null,
      });
    }

    res.json({
      success: true,
      message: 'Simulación obtenida exitosamente',
      data: {
        simulation: {
          id: simulation.id,
          wizard_data: simulation.wizard_data,
          report_data: simulation.report_data,
          status: simulation.status,
          created_at: simulation.created_at,
          updated_at: simulation.updated_at,
        },
      },
    });
  } catch (error) {
    console.error('Error al obtener simulación:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
    });
  }
};

// Obtener todas las simulaciones del usuario
const getUserSimulations = async (req, res) => {
  try {
    const userId = req.user.id;

    const simulations = await Simulation.findAll({
      where: {
        user_id: userId,
      },
      order: [['updated_at', 'DESC']],
    });

    res.json({
      success: true,
      message: 'Simulaciones obtenidas exitosamente',
      data: {
        simulations: simulations.map(sim => ({
          id: sim.id,
          status: sim.status,
          created_at: sim.created_at,
          updated_at: sim.updated_at,
          has_report: !!sim.report_data,
        })),
      },
    });
  } catch (error) {
    console.error('Error al obtener simulaciones:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
    });
  }
};

// Obtener simulación específica por ID
const getSimulationById = async (req, res) => {
  try {
    const userId = req.user.id;
    const simulationId = req.params.id;

    const simulation = await Simulation.findOne({
      where: {
        id: simulationId,
        user_id: userId,
      },
    });

    if (!simulation) {
      return res.status(404).json({
        success: false,
        message: 'Simulación no encontrada',
      });
    }

    res.json({
      success: true,
      message: 'Simulación obtenida exitosamente',
      data: {
        simulation: {
          id: simulation.id,
          wizard_data: simulation.wizard_data,
          report_data: simulation.report_data,
          status: simulation.status,
          created_at: simulation.created_at,
          updated_at: simulation.updated_at,
        },
      },
    });
  } catch (error) {
    console.error('Error al obtener simulación por ID:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
    });
  }
};

module.exports = {
  saveWizardData,
  getCurrentSimulation,
  getUserSimulations,
  getSimulationById,
};
