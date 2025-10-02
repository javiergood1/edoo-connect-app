import { useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Users, User, Heart, Baby, ArrowRight } from 'lucide-react';
import useWizardStore from '../../../stores/wizardStore';

const Step3FamilyOptimized = () => {
  const { formData, setStepData, nextStep } = useWizardStore();
  const stepData = formData.step3 || {};

  // Estado local sin autoguardado
  const [localData, setLocalData] = useState({
    familyStatus: stepData.familyStatus || '',
  });

  const [errors, setErrors] = useState({});

  // Manejar cambios sin autoguardado
  const handleRadioChange = useCallback((value) => {
    setLocalData({ familyStatus: value });
    if (errors.familyStatus) {
      setErrors({});
    }
  }, [errors.familyStatus]);

  // Manejar envío y avance al siguiente paso
  const handleNextStep = useCallback((e) => {
    e.preventDefault();
    
    if (!localData.familyStatus) {
      setErrors({ familyStatus: 'Por favor selecciona tu situación familiar' });
      return;
    }

    // Guardar datos y avanzar al siguiente paso
    setStepData(3, localData);
    nextStep();
  }, [localData, setStepData, nextStep]);

  // Función para obtener información de ayuda - memoizada
  const getHelpText = useCallback((status) => {
    switch (status) {
      case 'single':
        return {
          icon: <User className="h-5 w-5 text-blue-500" />,
          title: 'Viajando Solo',
          description: 'Los costos se calcularán para una persona. Esto incluye alojamiento individual, gastos personales y visa de estudiante.',
          color: 'blue',
        };
      case 'couple':
        return {
          icon: <Heart className="h-5 w-5 text-pink-500" />,
          title: 'Viajando en Pareja',
          description: 'Se incluirán costos para dos personas, visa de acompañante, alojamiento compartido y gastos de pareja.',
          color: 'pink',
        };
      case 'family':
        return {
          icon: <Baby className="h-5 w-5 text-green-500" />,
          title: 'Viajando con Familia',
          description: 'Los costos incluirán toda la familia: visas familiares, alojamiento familiar, educación para hijos y gastos adicionales.',
          color: 'green',
        };
      default:
        return null;
    }
  }, []);

  // Memoizar el texto de ayuda actual
  const currentHelpText = useMemo(() => {
    return getHelpText(localData.familyStatus);
  }, [localData.familyStatus, getHelpText]);

  // Memoizar componentes estáticos
  const headerSection = useMemo(() => (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Composición Familiar
      </h2>
      <p className="text-gray-600">
        ¿Viajarás solo o acompañado? Esto afecta significativamente los costos
      </p>
    </div>
  ), []);

  return (
    <div className="space-y-6">
      {headerSection}

      <form onSubmit={handleNextStep} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              ¿Cómo planeas viajar?
            </CardTitle>
            <CardDescription>
              Selecciona tu situación familiar para el viaje
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <RadioGroup
              value={localData.familyStatus}
              onValueChange={handleRadioChange}
              className="space-y-3"
            >
              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <RadioGroupItem value="single" id="single" />
                <Label htmlFor="single" className="flex-1 cursor-pointer">
                  <div className="font-medium">Solo/a</div>
                  <div className="text-sm text-gray-500">
                    Viajaré sin acompañantes
                  </div>
                </Label>
                <User className="h-5 w-5 text-blue-500" />
              </div>

              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <RadioGroupItem value="couple" id="couple" />
                <Label htmlFor="couple" className="flex-1 cursor-pointer">
                  <div className="font-medium">En pareja</div>
                  <div className="text-sm text-gray-500">
                    Viajaré con mi pareja (sin hijos)
                  </div>
                </Label>
                <Heart className="h-5 w-5 text-pink-500" />
              </div>

              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <RadioGroupItem value="family" id="family" />
                <Label htmlFor="family" className="flex-1 cursor-pointer">
                  <div className="font-medium">Con familia</div>
                  <div className="text-sm text-gray-500">
                    Viajaré con pareja y/o hijos
                  </div>
                </Label>
                <Baby className="h-5 w-5 text-green-500" />
              </div>
            </RadioGroup>

            {errors.familyStatus && (
              <p className="text-sm text-red-500 mt-2">{errors.familyStatus}</p>
            )}
          </CardContent>
        </Card>

        {/* Mostrar información de ayuda */}
        {currentHelpText && (
          <Alert className={`border-${currentHelpText.color}-200 bg-${currentHelpText.color}-50 flex items-start space-x-3`}>
            {currentHelpText.icon}
            <AlertDescription className="flex-1">
              <div className={`font-medium text-${currentHelpText.color}-900 mb-1 w-full`}>
                {currentHelpText.title}
              </div>
              <div className={`text-${currentHelpText.color}-800 text-sm w-full`}>
                {currentHelpText.description}
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="flex justify-end">
          <Button type="submit" className="px-8">
            <ArrowRight className="h-4 w-4 mr-2" />
            Siguiente Paso
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Step3FamilyOptimized;

