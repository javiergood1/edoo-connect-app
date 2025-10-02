import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Target, GraduationCap, Home, Info } from 'lucide-react';
import useWizardStore from '../../../stores/wizardStore';

const Step2MigrationGoal = () => {
  const { formData, setStepData } = useWizardStore();
  const stepData = formData.step2 || {};

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: stepData,
  });

  const migrationGoal = watch('migrationGoal', stepData.migrationGoal || '');

  const onSubmit = (data) => {
    setStepData(2, data);
  };

  // Guardar datos automáticamente cuando cambian
  useEffect(() => {
    const subscription = watch((data) => {
      setStepData(2, data);
    });
    return () => subscription.unsubscribe();
  }, [watch, setStepData]);

  const getHelpText = (goal) => {
    switch (goal) {
      case 'study_only':
        return {
          icon: <GraduationCap className="h-5 w-5 text-blue-500" />,
          title: 'Solo Estudios',
          description: 'Nos enfocaremos en los costos académicos y de vida temporal. Consideraremos gastos de visa de estudiante, alojamiento temporal y costos de regreso a tu país.',
          color: 'blue',
        };
      case 'study_residence':
        return {
          icon: <Home className="h-5 w-5 text-green-500" />,
          title: 'Estudios + Residencia Permanente',
          description: 'Incluiremos costos adicionales de inmigración, procesos de residencia permanente, y gastos de establecimiento a largo plazo en el país de destino.',
          color: 'green',
        };
      default:
        return null;
    }
  };

  const helpInfo = getHelpText(migrationGoal);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Objetivo Migratorio</h2>
        <p className="text-gray-600">
          ¿Cuál es tu objetivo principal al estudiar en el extranjero?
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Selecciona tu objetivo
            </CardTitle>
            <CardDescription>
              Esta información nos ayudará a personalizar tu análisis financiero
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={migrationGoal}
              onValueChange={(value) => setValue('migrationGoal', value)}
              className="space-y-4"
            >
              <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <RadioGroupItem value="study_only" id="study_only" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="study_only" className="cursor-pointer">
                    <div className="flex items-center mb-2">
                      <GraduationCap className="h-5 w-5 text-blue-500 mr-2" />
                      <span className="font-medium">Solo estudios (regresar a mi país después)</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Planeas completar tus estudios y regresar a tu país de origen. 
                      Nos enfocaremos en costos temporales y de corto plazo.
                    </p>
                  </Label>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <RadioGroupItem value="study_residence" id="study_residence" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="study_residence" className="cursor-pointer">
                    <div className="flex items-center mb-2">
                      <Home className="h-5 w-5 text-green-500 mr-2" />
                      <span className="font-medium">Estudios y residencia permanente</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Planeas establecerte permanentemente en el país de destino. 
                      Incluiremos costos de inmigración y establecimiento a largo plazo.
                    </p>
                  </Label>
                </div>
              </div>
            </RadioGroup>

            {errors.migrationGoal && (
              <p className="text-sm text-red-500 mt-2">{errors.migrationGoal.message}</p>
            )}

            <input
              type="hidden"
              {...register('migrationGoal', {
                required: 'Debes seleccionar un objetivo migratorio',
              })}
            />
          </CardContent>
        </Card>

        {/* Información de ayuda */}
        {helpInfo && (
          <Alert className={`border-${helpInfo.color}-200 bg-${helpInfo.color}-50`}>
            <div className="flex items-start">
              {helpInfo.icon}
              <div className="ml-3">
                <h4 className={`font-medium text-${helpInfo.color}-900`}>
                  {helpInfo.title}
                </h4>
                <AlertDescription className={`text-${helpInfo.color}-800 mt-1`}>
                  {helpInfo.description}
                </AlertDescription>
              </div>
            </div>
          </Alert>
        )}

        {/* Información adicional */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-start">
              <Info className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 mb-2">¿Por qué es importante esta información?</h4>
                <p className="text-sm text-blue-800">
                  Tu objetivo migratorio afecta significativamente los costos totales. Los estudiantes que buscan 
                  residencia permanente deben considerar gastos adicionales como procesos de inmigración, 
                  establecimiento de crédito, y costos de vida a largo plazo.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default Step2MigrationGoal;
