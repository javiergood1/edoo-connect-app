// Motor financiero para EdooConnect
// Calcula costos, proyecciones y genera recomendaciones

class FinancialEngine {
  constructor() {
    // Base de datos de costos por país y ciudad
    this.costDatabase = {
      canada: {
        ontario: {
          toronto: {
            tuition: { min: 15000, max: 45000, avg: 28000 },
            housing: { dormitory: 1000, shared: 800, individual: 1500, homestay: 900 },
            food: { monthly: 400 },
            transport: { public: 120, bicycle: 30, car: 500, walking: 0 },
            insurance: { monthly: 80 },
            misc: { monthly: 300 },
          },
          ottawa: {
            tuition: { min: 12000, max: 35000, avg: 22000 },
            housing: { dormitory: 800, shared: 600, individual: 1200, homestay: 750 },
            food: { monthly: 350 },
            transport: { public: 100, bicycle: 25, car: 450, walking: 0 },
            insurance: { monthly: 75 },
            misc: { monthly: 250 },
          },
        },
        'british-columbia': {
          vancouver: {
            tuition: { min: 18000, max: 50000, avg: 32000 },
            housing: { dormitory: 1200, shared: 1000, individual: 1800, homestay: 1100 },
            food: { monthly: 450 },
            transport: { public: 130, bicycle: 35, car: 550, walking: 0 },
            insurance: { monthly: 85 },
            misc: { monthly: 350 },
          },
        },
      },
      usa: {
        california: {
          'los-angeles': {
            tuition: { min: 25000, max: 60000, avg: 40000 },
            housing: { dormitory: 1500, shared: 1200, individual: 2200, homestay: 1300 },
            food: { monthly: 500 },
            transport: { public: 100, bicycle: 40, car: 600, walking: 0 },
            insurance: { monthly: 150 },
            misc: { monthly: 400 },
          },
        },
        'new-york': {
          'new-york-city': {
            tuition: { min: 30000, max: 70000, avg: 45000 },
            housing: { dormitory: 2000, shared: 1500, individual: 2800, homestay: 1600 },
            food: { monthly: 600 },
            transport: { public: 120, bicycle: 50, car: 800, walking: 0 },
            insurance: { monthly: 200 },
            misc: { monthly: 500 },
          },
        },
      },
    };

    // Factores de ajuste por perfil
    this.adjustmentFactors = {
      age: {
        '18-22': 0.9,  // Estudiantes jóvenes gastan menos
        '23-27': 1.0,  // Base
        '28-35': 1.1,  // Profesionales gastan más
        '36+': 1.2,    // Mayores con familia
      },
      familyStatus: {
        single: 1.0,
        couple: 1.7,   // No exactamente x2 por economías de escala
        family: 2.3,   // Con hijos
      },
      englishLevel: {
        basic: 1.2,    // Necesitan más apoyo/cursos
        intermediate: 1.1,
        advanced: 1.0,
      },
    };
  }

  // Calcular costos totales basado en datos del wizard
  calculateCosts(wizardData) {
    try {
      const country = wizardData.step6?.country;
      const state = wizardData.step7?.state;
      const city = wizardData.step7?.city;
      const programType = wizardData.step4?.programType;
      const housingType = wizardData.step8?.housingType;
      const transportType = wizardData.step9?.transportType;
      const familyStatus = wizardData.step3?.familyStatus || 'single';
      const age = parseInt(wizardData.step1?.age) || 25;
      const englishLevel = this.calculateEnglishLevel(wizardData.step1);

      // Obtener datos de costos base
      const locationData = this.costDatabase[country]?.[state]?.[city];
      if (!locationData) {
        throw new Error(`Datos de costos no disponibles para ${city}, ${state}, ${country}`);
      }

      // Calcular costos base
      const costs = {
        tuition: this.calculateTuition(locationData.tuition, programType),
        housing: locationData.housing[housingType] || locationData.housing.shared,
        food: locationData.food.monthly,
        transport: locationData.transport[transportType] || locationData.transport.public,
        insurance: locationData.insurance.monthly,
        miscellaneous: locationData.misc.monthly,
      };

      // Aplicar factores de ajuste
      const ageGroup = this.getAgeGroup(age);
      const adjustments = {
        age: this.adjustmentFactors.age[ageGroup] || 1.0,
        family: this.adjustmentFactors.familyStatus[familyStatus] || 1.0,
        english: this.adjustmentFactors.englishLevel[englishLevel] || 1.0,
      };

      // Calcular costos ajustados
      const adjustedCosts = {
        tuition: costs.tuition, // La matrícula no se ajusta por factores personales
        housing: Math.round(costs.housing * adjustments.family),
        food: Math.round(costs.food * adjustments.family * adjustments.age),
        transport: Math.round(costs.transport * adjustments.family),
        insurance: Math.round(costs.insurance * adjustments.family),
        miscellaneous: Math.round(costs.miscellaneous * adjustments.family * adjustments.age),
        englishSupport: englishLevel === 'basic' ? 200 : englishLevel === 'intermediate' ? 100 : 0,
      };

      // Calcular totales
      const monthlyTotal = Object.values(adjustedCosts).reduce((sum, cost) => sum + cost, 0) - adjustedCosts.tuition;
      const yearlyTotal = adjustedCosts.tuition + (monthlyTotal * 12);

      return {
        breakdown: adjustedCosts,
        totals: {
          monthly: monthlyTotal,
          yearly: yearlyTotal,
          tuitionOnly: adjustedCosts.tuition,
          livingExpenses: monthlyTotal * 12,
        },
        adjustments,
        metadata: {
          location: `${city}, ${state}, ${country}`,
          programType,
          familyStatus,
          calculatedAt: new Date().toISOString(),
        },
      };
    } catch (error) {
      console.error('Error calculating costs:', error);
      throw new Error('Error en el cálculo de costos: ' + error.message);
    }
  }

  // Generar proyección de flujo de caja
  generateCashFlowProjection(costs, wizardData, duration = 24) {
    const projection = [];
    const monthlyIncome = wizardData.step5?.monthlyIncome || 0;
    const savings = wizardData.step5?.currentSavings || 0;
    const workHours = wizardData.step5?.workHours || 0;
    
    // Estimar ingresos por trabajo de medio tiempo (si aplica)
    const partTimeIncome = workHours > 0 ? workHours * 15 * 4 : 0; // $15/hora promedio
    
    let cumulativeBalance = savings;
    
    for (let month = 1; month <= duration; month++) {
      const isFirstMonth = month === 1;
      const monthlyExpenses = costs.totals.monthly + (isFirstMonth ? costs.totals.tuitionOnly : 0);
      const monthlyInflows = monthlyIncome + partTimeIncome;
      const netFlow = monthlyInflows - monthlyExpenses;
      
      cumulativeBalance += netFlow;
      
      projection.push({
        month,
        income: monthlyInflows,
        expenses: monthlyExpenses,
        netFlow,
        cumulativeBalance,
        tuitionPayment: isFirstMonth ? costs.totals.tuitionOnly : 0,
        isDeficit: cumulativeBalance < 0,
      });
    }
    
    return {
      projection,
      summary: {
        totalIncome: projection.reduce((sum, p) => sum + p.income, 0),
        totalExpenses: projection.reduce((sum, p) => sum + p.expenses, 0),
        finalBalance: cumulativeBalance,
        monthsInDeficit: projection.filter(p => p.isDeficit).length,
        maxDeficit: Math.min(...projection.map(p => p.cumulativeBalance)),
      },
    };
  }

  // Análisis de riesgos financieros
  analyzeRisks(costs, cashFlow, wizardData) {
    const risks = [];
    const savings = wizardData.step5?.currentSavings || 0;
    const monthlyIncome = wizardData.step5?.monthlyIncome || 0;
    
    // Riesgo de fondos insuficientes
    if (savings < costs.totals.yearly * 0.5) {
      risks.push({
        type: 'insufficient_funds',
        severity: 'high',
        title: 'Fondos Insuficientes',
        description: 'Tus ahorros actuales cubren menos del 50% del costo total estimado.',
        recommendation: 'Considera ahorrar más antes de iniciar o buscar opciones de financiamiento.',
      });
    }
    
    // Riesgo de flujo de caja negativo
    if (cashFlow.summary.monthsInDeficit > 6) {
      risks.push({
        type: 'negative_cash_flow',
        severity: 'medium',
        title: 'Flujo de Caja Negativo Prolongado',
        description: `Tendrás déficit durante ${cashFlow.summary.monthsInDeficit} meses.`,
        recommendation: 'Busca oportunidades de trabajo de medio tiempo o reduce gastos opcionales.',
      });
    }
    
    // Riesgo de dependencia de ingresos
    if (monthlyIncome === 0) {
      risks.push({
        type: 'no_income',
        severity: 'medium',
        title: 'Sin Ingresos Regulares',
        description: 'No tienes ingresos regulares planificados durante tus estudios.',
        recommendation: 'Considera trabajo de medio tiempo o becas para reducir la presión financiera.',
      });
    }
    
    // Riesgo por ubicación costosa
    if (costs.totals.monthly > 2500) {
      risks.push({
        type: 'expensive_location',
        severity: 'low',
        title: 'Ubicación Costosa',
        description: 'La ciudad seleccionada tiene costos de vida superiores al promedio.',
        recommendation: 'Evalúa opciones de vivienda más económicas o ciudades alternativas.',
      });
    }
    
    return {
      risks,
      overallRisk: this.calculateOverallRisk(risks),
      riskScore: this.calculateRiskScore(costs, cashFlow, wizardData),
    };
  }

  // Generar recomendaciones personalizadas
  generateRecommendations(costs, cashFlow, risks, wizardData) {
    const recommendations = [];
    
    // Recomendaciones basadas en riesgos
    risks.risks.forEach(risk => {
      recommendations.push({
        category: 'risk_mitigation',
        priority: risk.severity === 'high' ? 1 : risk.severity === 'medium' ? 2 : 3,
        title: `Mitigar: ${risk.title}`,
        description: risk.recommendation,
        estimatedSavings: this.estimateRiskMitigationSavings(risk.type, costs),
      });
    });
    
    // Recomendaciones de ahorro
    if (costs.breakdown.housing > costs.totals.monthly * 0.4) {
      recommendations.push({
        category: 'cost_optimization',
        priority: 2,
        title: 'Optimizar Costos de Vivienda',
        description: 'Tu vivienda representa más del 40% de tus gastos mensuales. Considera opciones más económicas.',
        estimatedSavings: Math.round(costs.breakdown.housing * 0.2),
      });
    }
    
    // Recomendaciones de ingresos
    if (wizardData.step5?.workHours < 20) {
      recommendations.push({
        category: 'income_generation',
        priority: 2,
        title: 'Aumentar Ingresos con Trabajo de Medio Tiempo',
        description: 'Trabajar 20 horas semanales podría generar ingresos adicionales significativos.',
        estimatedSavings: -1200, // Ingreso adicional
      });
    }
    
    // Recomendaciones específicas por perfil
    const englishLevel = this.calculateEnglishLevel(wizardData.step1);
    if (englishLevel === 'basic') {
      recommendations.push({
        category: 'preparation',
        priority: 1,
        title: 'Mejorar Nivel de Inglés Antes del Viaje',
        description: 'Invertir en clases de inglés antes de viajar puede reducir costos de apoyo académico.',
        estimatedSavings: 150,
      });
    }
    
    return recommendations.sort((a, b) => a.priority - b.priority);
  }

  // Métodos auxiliares
  calculateTuition(tuitionData, programType) {
    const multipliers = {
      undergraduate: 1.0,
      graduate: 1.3,
      phd: 0.8, // Muchos PhD tienen funding
      certificate: 0.6,
      language: 0.4,
    };
    
    return Math.round(tuitionData.avg * (multipliers[programType] || 1.0));
  }

  calculateEnglishLevel(step1Data) {
    if (!step1Data) return 'intermediate';
    
    const speaking = step1Data.englishSpeaking || 5;
    const reading = step1Data.englishReading || 5;
    const listening = step1Data.englishListening || 5;
    const writing = step1Data.englishWriting || 5;
    
    const average = (speaking + reading + listening + writing) / 4;
    
    if (average >= 8) return 'advanced';
    if (average >= 6) return 'intermediate';
    return 'basic';
  }

  getAgeGroup(age) {
    if (age <= 22) return '18-22';
    if (age <= 27) return '23-27';
    if (age <= 35) return '28-35';
    return '36+';
  }

  calculateOverallRisk(risks) {
    const highRisks = risks.filter(r => r.severity === 'high').length;
    const mediumRisks = risks.filter(r => r.severity === 'medium').length;
    
    if (highRisks > 0) return 'high';
    if (mediumRisks > 1) return 'medium';
    return 'low';
  }

  calculateRiskScore(costs, cashFlow, wizardData) {
    let score = 50; // Base score
    
    const savings = wizardData.step5?.currentSavings || 0;
    const savingsRatio = savings / costs.totals.yearly;
    
    // Ajustar por ratio de ahorros
    if (savingsRatio > 1) score += 20;
    else if (savingsRatio > 0.5) score += 10;
    else if (savingsRatio < 0.3) score -= 20;
    
    // Ajustar por flujo de caja
    if (cashFlow.summary.finalBalance > 0) score += 15;
    if (cashFlow.summary.monthsInDeficit > 12) score -= 15;
    
    return Math.max(0, Math.min(100, score));
  }

  estimateRiskMitigationSavings(riskType, costs) {
    const savings = {
      insufficient_funds: 0,
      negative_cash_flow: Math.round(costs.totals.monthly * 0.1),
      no_income: -800, // Potential income
      expensive_location: Math.round(costs.breakdown.housing * 0.15),
    };
    
    return savings[riskType] || 0;
  }
}

module.exports = FinancialEngine;
