import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useWizardStore from '../stores/wizardStore';
import useAuthStore from '../stores/authStore';
import WizardLayout from '../components/wizard/WizardLayout';
import LoadingSpinner from '../components/ui/LoadingSpinner';

// Importar componentes de los pasos del wizard
import Step1PersonalInfo from '../components/wizard/steps/Step1PersonalInfoFinal';
import { Step2MigrationGoalOptimized as Step2MigrationGoal } from '../components/wizard/steps/Step2MigrationGoalOptimized';
import Step3Family from '../components/wizard/steps/Step3FamilyOptimized';
import Step4AcademicProgram from '../components/wizard/steps/Step4AcademicProgramOptimized';
import Step5Finances from '../components/wizard/steps/Step5FinancesOptimized';
import Step6Destination from '../components/wizard/steps/Step6DestinationWithFlags';
import { 
  Step7LocationOptimized as Step7Location,
  Step8HousingOptimized as Step8Housing,
  Step9TransportOptimized as Step9Transport,
  Step10ProfessionalProfileOptimized as Step10ProfessionalProfile,
  Step11SpouseProfileOptimized as Step11SpouseProfile
} from '../components/wizard/steps/StepsOptimized';

const WizardPage = () => {
  const { currentStep, loadFromBackend, isLoading, formData } = useWizardStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Cargar simulación existente al montar el componente
    loadFromBackend();
  }, [loadFromBackend]);

  // Renderizar el componente del paso actual
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1PersonalInfo />;
      case 2:
        return <Step2MigrationGoal />;
      case 3:
        return <Step3Family />;
      case 4:
        return <Step4AcademicProgram />;
      case 5:
        return <Step5Finances />;
      case 6:
        return <Step6Destination />;
      case 7:
        return <Step7Location />;
      case 8:
        return <Step8Housing />;
      case 9:
        return <Step9Transport />;
      case 10:
        return <Step10ProfessionalProfile />;
      case 11:
        return <Step11SpouseProfile />;
      default:
        return <Step1PersonalInfo />;
    }
  };

  // Verificar si debe mostrar el paso 11 (solo si viaja con pareja)
  const shouldShowStep11 = () => {
    const familyStatus = formData.step3?.familyStatus;
    return familyStatus === 'couple' || familyStatus === 'family';
  };

  // Manejar finalización del wizard
  const handleWizardComplete = () => {
    // Redirigir al dashboard o página de pago según el plan del usuario
    if (user?.is_premium) {
      navigate('/dashboard');
    } else {
      navigate('/payment');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
        <span className="ml-4 text-lg text-gray-600">Cargando tu simulación...</span>
      </div>
    );
  }

  return (
    <WizardLayout
      currentStep={currentStep}
      totalSteps={shouldShowStep11() ? 11 : 10}
      onComplete={handleWizardComplete}
    >
      {renderCurrentStep()}
    </WizardLayout>
  );
};

export default WizardPage;
