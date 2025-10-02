import { useEffect, useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, Calendar, Briefcase } from 'lucide-react';
import useWizardStore from '../../../stores/wizardStore';

const Step1PersonalInfo = () => {
  const { formData, setStepData } = useWizardStore();
  const stepData = formData.step1 || {};

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: stepData,
    mode: 'onBlur', // Solo validar cuando se pierde el foco
  });

  // Valores para los sliders de idioma - usando getValues en lugar de watch para evitar re-renders
  const speaking = watch('speaking', stepData.speaking || 5);
  const reading = watch('reading', stepData.reading || 5);
  const listening = watch('listening', stepData.listening || 5);
  const writing = watch('writing', stepData.writing || 5);

  // Memoizar el cálculo del nivel promedio
  const languageStats = useMemo(() => {
    const average = Math.round((speaking + reading + listening + writing) / 4);
    const level = average <= 3 ? 'Básico' : average <= 6 ? 'Intermedio' : 'Avanzado';
    return { average, level };
  }, [speaking, reading, listening, writing]);

  // Usar useCallback para las funciones de los sliders
  const handleSpeakingChange = useCallback((value) => {
    setValue('speaking', value[0]);
  }, [setValue]);

  const handleReadingChange = useCallback((value) => {
    setValue('reading', value[0]);
  }, [setValue]);

  const handleListeningChange = useCallback((value) => {
    setValue('listening', value[0]);
  }, [setValue]);

  const handleWritingChange = useCallback((value) => {
    setValue('writing', value[0]);
  }, [setValue]);

  const onSubmit = useCallback((data) => {
    setStepData(1, data);
  }, [setStepData]);

  // Debounce para el guardado automático - solo guardar después de 500ms sin cambios
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const subscription = watch((data) => {
        setStepData(1, data);
      });
      return () => subscription.unsubscribe();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [watch, setStepData]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Información Básica
        </h2>
        <p className="text-gray-600">
          Cuéntanos un poco sobre ti para personalizar tu análisis
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Información Personal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Datos Personales
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nombre Completo</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Tu nombre completo"
                  {...register('name', {
                    required: 'El nombre es requerido',
                  })}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email">Correo Electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    className="pl-10"
                    {...register('email', {
                      required: 'El correo es requerido',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Correo inválido',
                      },
                    })}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="age">Edad</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="age"
                    type="number"
                    placeholder="25"
                    className="pl-10"
                    {...register('age', {
                      required: 'La edad es requerida',
                      min: { value: 16, message: 'Edad mínima 16 años' },
                      max: { value: 65, message: 'Edad máxima 65 años' },
                    })}
                  />
                </div>
                {errors.age && (
                  <p className="text-sm text-red-500 mt-1">{errors.age.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="profession">Profesión Actual</Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="profession"
                    type="text"
                    placeholder="Ingeniero, Médico, Estudiante..."
                    className="pl-10"
                    {...register('profession', {
                      required: 'La profesión es requerida',
                    })}
                  />
                </div>
                {errors.profession && (
                  <p className="text-sm text-red-500 mt-1">{errors.profession.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Nivel de Inglés */}
        <Card>
          <CardHeader>
            <CardTitle>Nivel de Inglés</CardTitle>
            <CardDescription>
              Evalúa tu nivel actual en cada habilidad (1 = Básico, 10 = Nativo)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-medium">
                  Speaking (Hablar): {speaking}/10
                </Label>
                <Slider
                  value={[speaking]}
                  onValueChange={handleSpeakingChange}
                  max={10}
                  min={1}
                  step={1}
                  className="mt-2"
                />
              </div>

              <div>
                <Label className="text-sm font-medium">
                  Reading (Leer): {reading}/10
                </Label>
                <Slider
                  value={[reading]}
                  onValueChange={handleReadingChange}
                  max={10}
                  min={1}
                  step={1}
                  className="mt-2"
                />
              </div>

              <div>
                <Label className="text-sm font-medium">
                  Listening (Escuchar): {listening}/10
                </Label>
                <Slider
                  value={[listening]}
                  onValueChange={handleListeningChange}
                  max={10}
                  min={1}
                  step={1}
                  className="mt-2"
                />
              </div>

              <div>
                <Label className="text-sm font-medium">
                  Writing (Escribir): {writing}/10
                </Label>
                <Slider
                  value={[writing]}
                  onValueChange={handleWritingChange}
                  max={10}
                  min={1}
                  step={1}
                  className="mt-2"
                />
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Resumen de tu nivel:</h4>
              <p className="text-blue-800">
                <span className="font-semibold">Promedio: {languageStats.average}/10</span>
                {' - '}
                <span className="font-semibold">Nivel: {languageStats.level}</span>
              </p>
              <p className="text-sm text-blue-700 mt-1">
                Este nivel afectará los costos de cursos de idioma y programas preparatorios.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" className="px-8">
            Continuar
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Step1PersonalInfo;
