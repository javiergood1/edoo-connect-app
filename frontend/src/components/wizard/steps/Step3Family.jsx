import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, User, Heart, Baby } from 'lucide-react';
import useWizardStore from '../../../stores/wizardStore';

const Step3Family = () => {
  const { formData, setStepData } = useWizardStore();
  const stepData = formData.step3 || {};

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: stepData,
  });

  const familyStatus = watch('familyStatus', stepData.familyStatus || '');
  const showSpouseField = familyStatus === 'couple' || familyStatus === 'family';
  const showChildrenField = familyStatus === 'family';

  const onSubmit = (data) => {
    setStepData(3, data);
  };

  // Guardar datos automáticamente cuando cambian
  useEffect(() => {
    const subscription = watch((data) => {
      setStepData(3, data);
    });
    return () => subscription.unsubscribe();
  }, [watch, setStepData]);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Composición Familiar</h2>
        <p className="text-gray-600">
          ¿Viajarás solo o con tu familia? Esto afecta significativamente los costos
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              ¿Con quién viajarás?
            </CardTitle>
            <CardDescription>
              Selecciona la opción que mejor describa tu situación familiar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={familyStatus}
              onValueChange={(value) => setValue('familyStatus', value)}
              className="space-y-4"
            >
              <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <RadioGroupItem value="single" id="single" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="single" className="cursor-pointer">
                    <div className="flex items-center mb-2">
                      <User className="h-5 w-5 text-blue-500 mr-2" />
                      <span className="font-medium">Viajo solo/a</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Viajarás únicamente tú. Los costos se calcularán para una persona.
                    </p>
                  </Label>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <RadioGroupItem value="couple" id="couple" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="couple" className="cursor-pointer">
                    <div className="flex items-center mb-2">
                      <Heart className="h-5 w-5 text-red-500 mr-2" />
                      <span className="font-medium">Viajo con mi pareja</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Viajarás con tu pareja/cónyuge. Incluiremos costos para dos personas.
                    </p>
                  </Label>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <RadioGroupItem value="family" id="family" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="family" className="cursor-pointer">
                    <div className="flex items-center mb-2">
                      <Baby className="h-5 w-5 text-green-500 mr-2" />
                      <span className="font-medium">Viajo con mi familia completa (pareja e hijos)</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Viajarás con tu pareja e hijos. Calcularemos costos familiares completos.
                    </p>
                  </Label>
                </div>
              </div>
            </RadioGroup>

            {errors.familyStatus && (
              <p className="text-sm text-red-500 mt-2">{errors.familyStatus.message}</p>
            )}

            <input
              type="hidden"
              {...register('familyStatus', {
                required: 'Debes seleccionar tu situación familiar',
              })}
            />
          </CardContent>
        </Card>

        {/* Campos condicionales */}
        {showSpouseField && (
          <Card>
            <CardHeader>
              <CardTitle>Información de tu pareja</CardTitle>
              <CardDescription>
                Necesitamos algunos datos básicos de tu pareja para el análisis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="spouseName">Nombre de tu pareja</Label>
                <Input
                  id="spouseName"
                  type="text"
                  placeholder="Nombre de tu pareja"
                  {...register('spouseName', {
                    required: showSpouseField ? 'El nombre de tu pareja es requerido' : false,
                  })}
                  className={errors.spouseName ? 'border-red-500' : ''}
                />
                {errors.spouseName && (
                  <p className="text-sm text-red-500 mt-1">{errors.spouseName.message}</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {showChildrenField && (
          <Card>
            <CardHeader>
              <CardTitle>Información de tus hijos</CardTitle>
              <CardDescription>
                Los costos varían según el número de hijos que te acompañen
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="numberOfChildren">Número de hijos que viajarán contigo</Label>
                <Input
                  id="numberOfChildren"
                  type="number"
                  min="1"
                  max="10"
                  placeholder="1"
                  {...register('numberOfChildren', {
                    required: showChildrenField ? 'El número de hijos es requerido' : false,
                    min: {
                      value: 1,
                      message: 'Debe ser al menos 1 hijo',
                    },
                    max: {
                      value: 10,
                      message: 'Máximo 10 hijos',
                    },
                  })}
                  className={errors.numberOfChildren ? 'border-red-500' : ''}
                />
                {errors.numberOfChildren && (
                  <p className="text-sm text-red-500 mt-1">{errors.numberOfChildren.message}</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Información sobre costos */}
        {familyStatus && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <h4 className="font-medium text-blue-900 mb-2">Impacto en los costos</h4>
              <div className="text-sm text-blue-800">
                {familyStatus === 'single' && (
                  <p>Como viajas solo, los costos serán optimizados para una persona, incluyendo alojamiento individual y gastos personales.</p>
                )}
                {familyStatus === 'couple' && (
                  <p>Al viajar con tu pareja, consideraremos alojamiento para dos personas, visas adicionales, y gastos de vida para ambos.</p>
                )}
                {familyStatus === 'family' && (
                  <p>Para familias completas incluiremos costos de educación para los hijos, alojamiento familiar, seguros médicos familiares y gastos adicionales.</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </form>
    </div>
  );
};

export default Step3Family;
