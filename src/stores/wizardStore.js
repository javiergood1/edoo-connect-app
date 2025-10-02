import { create } from 'zustand';
import { simulationService } from '../services/api';

const useWizardStore = create((set, get) => ({
  // Estado del wizard
  currentStep: 1,
  totalSteps: 11,
  formData: {
    step1: {}, // Información básica
    step2: {}, // Objetivo migratorio
    step3: {}, // Familia
    step4: {}, // Programa académico
    step5: {}, // Finanzas
    step6: {}, // Destino
    step7: {}, // Ubicación
    step8: {}, // Vivienda
    step9: {}, // Transporte
    step10: {}, // Perfil profesional
    step11: {}, // Perfil del cónyuge
  },
  isLoading: false,
  error: null,
  simulationId: null,

  // Acciones de navegación
  nextStep: () => {
    const { currentStep, totalSteps } = get();
    if (currentStep < totalSteps) {
      set({ currentStep: currentStep + 1 });
    }
  },

  prevStep: () => {
    const { currentStep } = get();
    if (currentStep > 1) {
      set({ currentStep: currentStep - 1 });
    }
  },

  goToStep: (step) => {
    if (step >= 1 && step <= get().totalSteps) {
      set({ currentStep: step });
    }
  },

  // Acciones de datos
  setStepData: async (step, data) => {
    const { formData } = get();
    const updatedFormData = {
      ...formData,
      [`step${step}`]: { ...formData[`step${step}`], ...data },
    };
    
    set({ 
      formData: updatedFormData,
      isLoading: true,
      error: null 
    });

    // Guardar en el backend automáticamente
    try {
      const response = await simulationService.saveWizardData(updatedFormData);
      set({ 
        simulationId: response.data.simulation.id,
        isLoading: false 
      });
    } catch (error) {
      console.error('Error al guardar datos del wizard:', error);
      set({ 
        error: 'Error al guardar los datos',
        isLoading: false 
      });
    }
  },

  // Cargar simulación desde el backend
  loadFromBackend: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await simulationService.getCurrentSimulation();
      if (response.data && response.data.simulation) {
        const { wizard_data, id } = response.data.simulation;
        set({
          formData: wizard_data || get().formData,
          simulationId: id,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Error al cargar simulación:', error);
      set({ 
        error: 'Error al cargar la simulación',
        isLoading: false 
      });
    }
  },

  // Reiniciar wizard
  resetWizard: () => {
    set({
      currentStep: 1,
      formData: {
        step1: {},
        step2: {},
        step3: {},
        step4: {},
        step5: {},
        step6: {},
        step7: {},
        step8: {},
        step9: {},
        step10: {},
        step11: {},
      },
      simulationId: null,
      error: null,
    });
  },

  // Validar si un paso está completo
  isStepComplete: (step) => {
    const stepData = get().formData[`step${step}`];
    if (!stepData) return false;

    // Validaciones específicas por paso
    switch (step) {
      case 1:
        return stepData.name && stepData.email && stepData.age && stepData.profession;
      case 2:
        return stepData.migrationGoal;
      case 3:
        return stepData.familyStatus;
      case 4:
        return stepData.programType && stepData.duration && stepData.tuitionCost;
      case 5:
        return stepData.savings && stepData.monthlyIncome && stepData.monthlyExpenses;
      case 6:
        return stepData.country;
      case 7:
        return stepData.state && stepData.city;
      case 8:
        return stepData.housingType;
      case 9:
        return stepData.transportType;
      case 10:
        return stepData.fieldOfStudy && stepData.workExperience && stepData.educationLevel;
      case 11:
        // Solo requerido si viaja con pareja
        const familyStatus = get().formData.step3?.familyStatus;
        if (familyStatus === 'couple' || familyStatus === 'family') {
          return stepData.spouseAge && stepData.spouseFieldOfStudy;
        }
        return true;
      default:
        return false;
    }
  },

  // Obtener progreso del wizard
  getProgress: () => {
    const { currentStep, totalSteps } = get();
    return Math.round((currentStep / totalSteps) * 100);
  },

  // Limpiar errores
  clearError: () => {
    set({ error: null });
  },
}));

export default useWizardStore;
