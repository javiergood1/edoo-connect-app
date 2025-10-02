const FinancialEngine = require('../services/financialEngine');
const { User, Simulation } = require('../models');

// Generar análisis financiero completo
const generateFinancialAnalysis = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
      });
    }

    // Obtener simulación actual del usuario
    const simulation = await Simulation.findOne({
      where: { user_id: userId },
      order: [['updated_at', 'DESC']],
    });

    if (!simulation || !simulation.wizard_data) {
      return res.status(400).json({
        success: false,
        message: 'No se encontraron datos del wizard. Completa el wizard primero.',
      });
    }

    const wizardData = simulation.wizard_data;

    // Validar que se tengan los datos mínimos necesarios
    if (!wizardData.step6?.country || !wizardData.step7?.city) {
      return res.status(400).json({
        success: false,
        message: 'Datos incompletos. Completa al menos hasta el paso 7 del wizard.',
      });
    }

    // Inicializar motor financiero
    const engine = new FinancialEngine();

    try {
      // Calcular costos
      const costs = engine.calculateCosts(wizardData);

      // Generar proyección de flujo de caja
      const cashFlow = engine.generateCashFlowProjection(costs, wizardData);

      // Analizar riesgos
      const riskAnalysis = engine.analyzeRisks(costs, cashFlow, wizardData);

      // Generar recomendaciones
      const recommendations = engine.generateRecommendations(costs, cashFlow, riskAnalysis, wizardData);

      // Preparar respuesta básica (para usuarios gratuitos)
      const basicAnalysis = {
        costs: {
          breakdown: costs.breakdown,
          totals: costs.totals,
          location: costs.metadata.location,
        },
        summary: {
          monthlyExpenses: costs.totals.monthly,
          yearlyTotal: costs.totals.yearly,
          riskLevel: riskAnalysis.overallRisk,
          riskScore: riskAnalysis.riskScore,
        },
        basicRecommendations: recommendations.slice(0, 3), // Solo las 3 principales
      };

      // Respuesta completa (para usuarios premium)
      const premiumAnalysis = {
        ...basicAnalysis,
        cashFlow: {
          projection: cashFlow.projection,
          summary: cashFlow.summary,
        },
        riskAnalysis: {
          risks: riskAnalysis.risks,
          overallRisk: riskAnalysis.overallRisk,
          riskScore: riskAnalysis.riskScore,
        },
        recommendations: recommendations,
        insights: {
          savingsNeeded: Math.max(0, costs.totals.yearly - (wizardData.step5?.currentSavings || 0)),
          monthsToSave: Math.ceil(Math.max(0, costs.totals.yearly - (wizardData.step5?.currentSavings || 0)) / Math.max(1, wizardData.step5?.monthlyIncome || 1)),
          costPerMonth: costs.totals.monthly,
          affordabilityIndex: this.calculateAffordabilityIndex(costs, wizardData),
        },
        metadata: {
          generatedAt: new Date().toISOString(),
          isPremium: user.is_premium,
          wizardCompleteness: this.calculateWizardCompleteness(wizardData),
        },
      };

      // Guardar análisis en la simulación
      const reportData = user.is_premium ? premiumAnalysis : basicAnalysis;
      await simulation.update({
        report_data: reportData,
        status: 'completed',
      });

      // Responder según el tipo de usuario
      res.json({
        success: true,
        data: reportData,
        message: user.is_premium 
          ? 'Análisis premium generado exitosamente'
          : 'Análisis básico generado. Actualiza a Premium para el análisis completo.',
      });

    } catch (engineError) {
      console.error('Error en motor financiero:', engineError);
      res.status(400).json({
        success: false,
        message: engineError.message || 'Error en el cálculo financiero',
      });
    }

  } catch (error) {
    console.error('Error generando análisis financiero:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Obtener análisis existente
const getExistingAnalysis = async (req, res) => {
  try {
    const userId = req.user.id;

    const simulation = await Simulation.findOne({
      where: { user_id: userId },
      order: [['updated_at', 'DESC']],
    });

    if (!simulation || !simulation.report_data) {
      return res.status(404).json({
        success: false,
        message: 'No se encontró análisis previo. Genera uno nuevo.',
      });
    }

    res.json({
      success: true,
      data: simulation.report_data,
    });

  } catch (error) {
    console.error('Error obteniendo análisis:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
    });
  }
};

// Exportar análisis a PDF (solo premium)
const exportToPDF = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId);

    if (!user || !user.is_premium) {
      return res.status(403).json({
        success: false,
        message: 'Función disponible solo para usuarios Premium',
      });
    }

    const simulation = await Simulation.findOne({
      where: { user_id: userId },
      order: [['updated_at', 'DESC']],
    });

    if (!simulation || !simulation.report_data) {
      return res.status(404).json({
        success: false,
        message: 'No se encontró análisis para exportar',
      });
    }

    // TODO: Implementar generación de PDF
    // Por ahora, devolver los datos para que el frontend genere el PDF
    res.json({
      success: true,
      data: {
        reportData: simulation.report_data,
        userInfo: {
          name: user.name,
          email: user.email,
        },
        exportFormat: 'pdf',
      },
      message: 'Datos preparados para exportación PDF',
    });

  } catch (error) {
    console.error('Error exportando a PDF:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
    });
  }
};

// Métodos auxiliares
const calculateAffordabilityIndex = (costs, wizardData) => {
  const savings = wizardData.step5?.currentSavings || 0;
  const monthlyIncome = wizardData.step5?.monthlyIncome || 0;
  
  const totalNeeded = costs.totals.yearly;
  const availableResources = savings + (monthlyIncome * 12);
  
  return Math.min(100, Math.round((availableResources / totalNeeded) * 100));
};

const calculateWizardCompleteness = (wizardData) => {
  const totalSteps = 11;
  let completedSteps = 0;
  
  for (let i = 1; i <= totalSteps; i++) {
    if (wizardData[`step${i}`] && Object.keys(wizardData[`step${i}`]).length > 0) {
      completedSteps++;
    }
  }
  
  return Math.round((completedSteps / totalSteps) * 100);
};

module.exports = {
  generateFinancialAnalysis,
  getExistingAnalysis,
  exportToPDF,
};
