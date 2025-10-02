import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart } from 'lucide-react';
import useWizardStore from '../../../stores/wizardStore';

const Step11SpouseProfile = () => {
  const { formData, setStepData } = useWizardStore();
  const stepData = formData.step11 || {};
  const familyStatus = formData.step3?.familyStatus;

  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: stepData,
  });

  const spouseFieldOfStudy = watch('spouseFieldOfStudy', stepData.spouseFieldOfStudy || '');
  const spouseEducationLevel = watch('spouseEducationLevel', stepData.spouseEducationLevel || '');

  const fields = [
    'Ingeniería', 'Medicina', 'Negocios', 'Tecnología', 'Arte y Diseño',
    'Ciencias', 'Educación', 'Derecho', 'Psicología', 'Otro'
  ];

  const educationLevels = [
    { value: 'high-school', label: 'Bachillerato' },
    { value: 'bachelor', label: 'Licenciatura' },
    { value: 'master', label: 'Maestría' },
    { value: 'phd', label: 'Doctorado' },
  ];

  useEffect(() => {
    const subscription = watch((data) => {
      setStepData(11, data);
    });
    return () => subscription.unsubscribe();
  }, [watch, setStepData]);

  // Si no viaja con pareja, no mostrar este paso
  if (familyStatus !== 'couple' && familyStatus !== 'family') {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Paso Completado</h2>
        <p className="text-gray-600">
          Como viajas solo, no necesitamos información adicional de pareja.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Perfil de tu Pareja</h2>
        <p className="text-gray-600">
          Información sobre el perfil profesional de tu pareja
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Heart className="h-5 w-5 mr-2" />
            Información de tu Pareja
          </CardTitle>
          <CardDescription>
            Esta información nos ayuda a calcular costos adicionales y oportunidades laborales
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="spouseAge">Edad de tu Pareja *</Label>
            <Input
              id="spouseAge"
              type="number"
              min="16"
              max="65"
              placeholder="28"
              {...register('spouseAge', {
                required: 'La edad de tu pareja es requerida',
                min: { value: 16, message: 'Debe ser mayor de 16 años' },
                max: { value: 65, message: 'Edad máxima 65 años' },
              })}
              className={errors.spouseAge ? 'border-red-500' : ''}
            />
            {errors.spouseAge && (
              <p className="text-sm text-red-500 mt-1">{errors.spouseAge.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="spouseFieldOfStudy">Campo de Estudio/Trabajo de tu Pareja *</Label>
            <Select value={spouseFieldOfStudy} onValueChange={(value) => setValue('spouseFieldOfStudy', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el campo de tu pareja" />
              </SelectTrigger>
              <SelectContent>
                {fields.map((field) => (
                  <SelectItem key={field} value={field.toLowerCase()}>
                    {field}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input type="hidden" {...register('spouseFieldOfStudy', { required: 'Debes seleccionar el campo de tu pareja' })} />
            {errors.spouseFieldOfStudy && (
              <p className="text-sm text-red-500 mt-1">{errors.spouseFieldOfStudy.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="spouseWorkExperience">Años de Experiencia Laboral de tu Pareja</Label>
            <Input
              id="spouseWorkExperience"
              type="number"
              min="0"
              max="50"
              placeholder="5"
              {...register('spouseWorkExperience', {
                min: { value: 0, message: 'No puede ser negativo' },
                max: { value: 50, message: 'Máximo 50 años' },
              })}
              className={errors.spouseWorkExperience ? 'border-red-500' : ''}
            />
            {errors.spouseWorkExperience && (
              <p className="text-sm text-red-500 mt-1">{errors.spouseWorkExperience.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="spouseEducationLevel">Nivel Educativo de tu Pareja</Label>
            <Select value={spouseEducationLevel} onValueChange={(value) => setValue('spouseEducationLevel', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el nivel educativo de tu pareja" />
              </SelectTrigger>
              <SelectContent>
                {educationLevels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input type="hidden" {...register('spouseEducationLevel')} />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h4 className="font-medium text-blue-900 mb-2">¿Por qué necesitamos esta información?</h4>
          <p className="text-sm text-blue-800">
            El perfil de tu pareja nos ayuda a calcular costos adicionales como visas dependientes, 
            seguros médicos familiares, y evaluar oportunidades de trabajo que pueden reducir 
            los gastos totales del proyecto migratorio.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Step11SpouseProfile;
