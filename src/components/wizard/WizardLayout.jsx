import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Globe, ArrowLeft, ArrowRight, Home } from 'lucide-react';
import useWizardStore from '../../stores/wizardStore';
import useAuthStore from '../../stores/authStore';

const WizardLayout = ({ children, currentStep, totalSteps, onComplete }) => {
  const { nextStep, prevStep, isStepComplete, getProgress } = useWizardStore();
  const { user, logout } = useAuthStore();

  const progress = getProgress();
  const canGoNext = isStepComplete(currentStep);
  const isLastStep = currentStep === totalSteps;

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      nextStep();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      prevStep();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <Globe className="h-8 w-8 text-blue-600 mr-2" />
                <span className="text-xl font-bold text-gray-900">EdooConnect</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Hola, {user?.name}
              </span>
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">
                  <Home className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={logout}>
                Salir
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Wizard Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Simulación Financiera EdooConnect
            </h1>
            <p className="text-lg text-gray-600">
              Paso {currentStep} de {totalSteps}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <Progress value={progress} className="h-3" />
          </div>

          {/* Step Indicators */}
          <div className="flex justify-center">
            <div className="flex space-x-2">
              {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
                <div
                  key={step}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step === currentStep
                      ? 'bg-blue-600 text-white'
                      : step < currentStep
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Step Content */}
        <Card className="mb-8">
          <CardContent className="p-8">
            {children}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Anterior
          </Button>

          <div className="flex space-x-4">
            <Link to="/dashboard">
              <Button variant="ghost">
                Guardar y Continuar Después
              </Button>
            </Link>
            
            <Button
              onClick={handleNext}
              disabled={!canGoNext}
              className="flex items-center"
            >
              {isLastStep ? 'Finalizar' : 'Siguiente'}
              {!isLastStep && <ArrowRight className="h-4 w-4 ml-2" />}
            </Button>
          </div>
        </div>

        {/* Help Text */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Tu progreso se guarda automáticamente. Puedes continuar en cualquier momento.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WizardLayout;
