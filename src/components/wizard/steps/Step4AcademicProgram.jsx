import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Clock, DollarSign } from 'lucide-react';
import useWizardStore from '../../../stores/wizardStore';

const Step4AcademicProgram = () => {
  const { formData, setStepData } = useWizardStore();
  const stepData = formData.step4 || {};

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: stepData,
  });

  const programType = watch('programType', stepData.programType || '');
  const duration = watch('duration', stepData.duration || '');
  const tuitionCost = watch('tuitionCost', stepData.tuitionCost || '');

  const onSubmit = (data) => {
    setStepData(4, data);
  };

  // Guardar datos automáticamente cuando cambian
  useEffect(() => {
    const subscription = watch((data) => {
      setStepData(4, data);
    });
    return () => subscription.unsubscribe();
  }, [watch, setStepData]);

  const programTypes = [
    { value: 'certificate', label: 'Certificado/Diploma (6 meses - 1 año)' },
    { value: 'associate', label: 'Associate Degree (2 años)' },
    { value: 'bachelor', label: "Bachelor's Degree (3-4 años)" },
    { value: 'master', label: "Master's Degree (1-2 años)" },
    { value: 'phd', label: 'PhD/Doctorado (3-5 años)' },
    { value: 'language', label: 'Curso de Idiomas (3-12 meses)' },
    { value: 'professional', label: 'Programa Profesional/Técnico' },
  ];

  const getDurationSuggestion = (type) => {
    const suggestions = {
      certificate: '1',
      associate: '2',
      bachelor: '4',
      master: '2',
      phd: '4',
      language: '0.5',
      professional: '1.5',
    };
    return suggestions[type] || '';
  };

  // Actualizar duración sugerida cuando cambia el tipo de programa
  useEffect(() => {
    if (programType && !duration) {
      const suggestion = getDurationSuggestion(programType);
      if (suggestion) {
        setValue('duration', suggestion);
      }
    }
  }, [programType, duration, setValue]);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Programa Académico</h2>
        <p className="text-gray-600">
          Cuéntanos sobre el programa de estudios que planeas cursar
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Tipo de Programa */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <GraduationCap className="h-5 w-5 mr-2" />
              Tipo de Programa
            </CardTitle>
            <CardDescription>
              Selecciona el tipo de programa académico que planeas estudiar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="programType">Tipo de Programa *</Label>
              <Select
                value={programType}
                onValueChange={(value) => setValue('programType', value)}
              >
                <SelectTrigger className={errors.programType ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Selecciona el tipo de programa" />
                </SelectTrigger>
                <SelectContent>
                  {programTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.programType && (
                <p className="text-sm text-red-500 mt-1">{errors.programType.message}</p>
              )}
              <input
                type="hidden"
                {...register('programType', {
                  required: 'Debes seleccionar un tipo de programa',
                })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Duración y Costo */}
        <Card>
          <CardHeader>
            <CardTitle>Detalles del Programa</CardTitle>
            <CardDescription>
              Información específica sobre la duración y costos de tu programa
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="duration" className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Duración del Programa (años) *
                </Label>
                <Input
                  id="duration"
                  type="number"
                  step="0.5"
                  min="0.5"
                  max="10"
                  placeholder="2"
                  {...register('duration', {
                    required: 'La duración es requerida',
                    min: {
                      value: 0.5,
                      message: 'La duración mínima es 0.5 años (6 meses)',
                    },
                    max: {
                      value: 10,
                      message: 'La duración máxima es 10 años',
                    },
                  })}
                  className={errors.duration ? 'border-red-500' : ''}
                />
                {errors.duration && (
                  <p className="text-sm text-red-500 mt-1">{errors.duration.message}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Ejemplo: 1.5 para un año y medio
                </p>
              </div>

              <div>
                <Label htmlFor="tuitionCost" className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Costo Anual de Matrícula (USD) *
                </Label>
                <Input
                  id="tuitionCost"
                  type="number"
                  min="1000"
                  max="100000"
                  placeholder="25000"
                  {...register('tuitionCost', {
                    required: 'El costo de matrícula es requerido',
                    min: {
                      value: 1000,
                      message: 'El costo mínimo es $1,000 USD',
                    },
                    max: {
                      value: 100000,
                      message: 'El costo máximo es $100,000 USD',
                    },
                  })}
                  className={errors.tuitionCost ? 'border-red-500' : ''}
                />
                {errors.tuitionCost && (
                  <p className="text-sm text-red-500 mt-1">{errors.tuitionCost.message}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Ingresa el costo anual en dólares estadounidenses
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resumen de costos */}
        {programType && duration && tuitionCost && (
          <Card className="bg-green-50 border-green-200">
            <CardContent className="pt-6">
              <h4 className="font-medium text-green-900 mb-2">Resumen de Costos Académicos</h4>
              <div className="text-sm text-green-800 space-y-1">
                <p><strong>Programa:</strong> {programTypes.find(p => p.value === programType)?.label}</p>
                <p><strong>Duración:</strong> {duration} año(s)</p>
                <p><strong>Costo anual:</strong> ${parseInt(tuitionCost).toLocaleString()} USD</p>
                <p><strong>Costo total de matrícula:</strong> ${(parseInt(tuitionCost) * parseFloat(duration)).toLocaleString()} USD</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Información adicional */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <h4 className="font-medium text-blue-900 mb-2">💡 Consejos para calcular los costos</h4>
            <div className="text-sm text-blue-800 space-y-2">
              <p>• Verifica si el costo incluye materiales, laboratorios o actividades adicionales</p>
              <p>• Algunos programas tienen costos diferentes para estudiantes internacionales</p>
              <p>• Considera posibles aumentos anuales en la matrícula</p>
              <p>• Investiga si hay becas o ayudas financieras disponibles</p>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default Step4AcademicProgram;
