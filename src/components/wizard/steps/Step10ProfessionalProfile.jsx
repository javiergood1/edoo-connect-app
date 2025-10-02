import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase } from 'lucide-react';
import useWizardStore from '../../../stores/wizardStore';

const Step10ProfessionalProfile = () => {
  const { formData, setStepData } = useWizardStore();
  const stepData = formData.step10 || {};

  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: stepData,
  });

  const fieldOfStudy = watch('fieldOfStudy', stepData.fieldOfStudy || '');
  const educationLevel = watch('educationLevel', stepData.educationLevel || '');

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
      setStepData(10, data);
    });
    return () => subscription.unsubscribe();
  }, [watch, setStepData]);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Perfil Profesional</h2>
        <p className="text-gray-600">Información sobre tu experiencia y educación</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Briefcase className="h-5 w-5 mr-2" />
            Experiencia Profesional
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="fieldOfStudy">Campo de Estudio/Trabajo *</Label>
            <Select value={fieldOfStudy} onValueChange={(value) => setValue('fieldOfStudy', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona tu campo" />
              </SelectTrigger>
              <SelectContent>
                {fields.map((field) => (
                  <SelectItem key={field} value={field.toLowerCase()}>
                    {field}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input type="hidden" {...register('fieldOfStudy', { required: 'Debes seleccionar un campo' })} />
            {errors.fieldOfStudy && (
              <p className="text-sm text-red-500 mt-1">{errors.fieldOfStudy.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="workExperience">Años de Experiencia Laboral *</Label>
            <Input
              id="workExperience"
              type="number"
              min="0"
              max="50"
              placeholder="3"
              {...register('workExperience', {
                required: 'Los años de experiencia son requeridos',
                min: { value: 0, message: 'No puede ser negativo' },
                max: { value: 50, message: 'Máximo 50 años' },
              })}
              className={errors.workExperience ? 'border-red-500' : ''}
            />
            {errors.workExperience && (
              <p className="text-sm text-red-500 mt-1">{errors.workExperience.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="educationLevel">Nivel Educativo Actual *</Label>
            <Select value={educationLevel} onValueChange={(value) => setValue('educationLevel', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona tu nivel educativo" />
              </SelectTrigger>
              <SelectContent>
                {educationLevels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input type="hidden" {...register('educationLevel', { required: 'Debes seleccionar un nivel educativo' })} />
            {errors.educationLevel && (
              <p className="text-sm text-red-500 mt-1">{errors.educationLevel.message}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Step10ProfessionalProfile;
