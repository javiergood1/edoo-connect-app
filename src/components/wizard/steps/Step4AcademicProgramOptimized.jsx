import { useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { GraduationCap, Clock, DollarSign, ArrowRight } from 'lucide-react';
import useWizardStore from '../../../stores/wizardStore';

const Step4AcademicProgramOptimized = () => {
  const { formData, setStepData, nextStep } = useWizardStore();
  const stepData = formData.step4 || {};

  // Estado local sin autoguardado
  const [localData, setLocalData] = useState({
    programType: stepData.programType || '',
    duration: stepData.duration || '',
    tuitionCost: stepData.tuitionCost || '',
    institution: stepData.institution || '',
    programName: stepData.programName || '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Opciones de programas
  const programTypes = useMemo(() => [
    { value: 'certificate', label: 'Certificado/Diploma (6 meses - 1 año)' },
    { value: 'associate', label: 'Associate Degree (2 años)' },
    { value: 'bachelor', label: "Bachelor's Degree (3-4 años)" },
    { value: 'master', label: "Master's Degree (1-2 años)" },
    { value: 'phd', label: 'PhD/Doctorado (3-5 años)' },
    { value: 'language', label: 'Curso de Idiomas (3-12 meses)' },
    { value: 'professional', label: 'Programa Profesional/Técnico' },
  ], []);

  // Función de validación
  const validateField = useCallback((name, value) => {
    switch (name) {
      case 'programType':
        return !value ? 'Selecciona un tipo de programa' : '';
      case 'duration':
        const duration = parseInt(value);
        if (isNaN(duration) || duration < 1) return 'La duración debe ser al menos 1 mes';
        if (duration > 60) return 'La duración máxima es 60 meses';
        return '';
      case 'tuitionCost':
        const cost = parseFloat(value);
        if (isNaN(cost) || cost < 0) return 'El costo debe ser un número válido';
        return '';
      case 'institution':
        return value.length < 2 ? 'El nombre de la institución es requerido' : '';
      case 'programName':
        return value.length < 2 ? 'El nombre del programa es requerido' : '';
      default:
        return '';
    }
  }, []);

  // Obtener sugerencia de duración basada en el tipo de programa
  const getDurationSuggestion = useCallback((type) => {
    switch (type) {
      case 'certificate': return '6-12 meses';
      case 'associate': return '24 meses';
      case 'bachelor': return '36-48 meses';
      case 'master': return '12-24 meses';
      case 'phd': return '36-60 meses';
      case 'language': return '3-12 meses';
      case 'professional': return '6-18 meses';
      default: return '';
    }
  }, []);

  // Manejar cambios en campos de texto
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setLocalData(prev => ({ ...prev, [name]: value }));
  }, []);

  // Manejar cambios en select
  const handleSelectChange = useCallback((name) => (value) => {
    setLocalData(prev => ({ ...prev, [name]: value }));
    // Limpiar errores cuando se selecciona
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  // Manejar blur para validación
  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  }, [validateField]);

  // Manejar envío y avance al siguiente paso
  const handleNextStep = useCallback((e) => {
    e.preventDefault();
    
    // Validar todos los campos requeridos
    const newErrors = {};
    const requiredFields = ['programType', 'duration', 'tuitionCost', 'institution', 'programName'];
    
    requiredFields.forEach(field => {
      const error = validateField(field, localData[field]);
      if (error) newErrors[field] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched({
        programType: true,
        duration: true,
        tuitionCost: true,
        institution: true,
        programName: true,
      });
      return;
    }

    // Guardar datos y avanzar al siguiente paso
    setStepData(4, localData);
    nextStep();
  }, [localData, validateField, setStepData, nextStep]);

  // Memoizar componentes estáticos
  const headerSection = useMemo(() => (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Programa Académico
      </h2>
      <p className="text-gray-600">
        Detalles sobre el programa de estudios que planeas cursar
      </p>
    </div>
  ), []);

  // Memoizar información de ayuda
  const durationSuggestion = useMemo(() => {
    return getDurationSuggestion(localData.programType);
  }, [localData.programType, getDurationSuggestion]);

  return (
    <div className="space-y-6">
      {headerSection}

      <form onSubmit={handleNextStep} className="space-y-6">
        {/* Tipo de Programa */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <GraduationCap className="h-5 w-5 mr-2" />
              Información del Programa
            </CardTitle>
            <CardDescription>
              Selecciona el tipo de programa que planeas estudiar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="programType">Tipo de Programa</Label>
                <Select
                  value={localData.programType}
                  onValueChange={handleSelectChange('programType')}
                >
                  <SelectTrigger className={touched.programType && errors.programType ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Selecciona un programa" />
                  </SelectTrigger>
                  <SelectContent>
                    {programTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {touched.programType && errors.programType && (
                  <p className="text-sm text-red-500 mt-1">{errors.programType}</p>
                )}
              </div>

              <div>
                <Label htmlFor="duration">Duración (meses)</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="duration"
                    name="duration"
                    type="number"
                    placeholder="24"
                    className={`pl-10 ${touched.duration && errors.duration ? 'border-red-500' : ''}`}
                    value={localData.duration}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                  />
                </div>
                {durationSuggestion && (
                  <p className="text-xs text-gray-500 mt-1">
                    Sugerido: {durationSuggestion}
                  </p>
                )}
                {touched.duration && errors.duration && (
                  <p className="text-sm text-red-500 mt-1">{errors.duration}</p>
                )}
              </div>

              <div>
                <Label htmlFor="institution">Institución</Label>
                <Input
                  id="institution"
                  name="institution"
                  type="text"
                  placeholder="Universidad de Toronto"
                  className={touched.institution && errors.institution ? 'border-red-500' : ''}
                  value={localData.institution}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                />
                {touched.institution && errors.institution && (
                  <p className="text-sm text-red-500 mt-1">{errors.institution}</p>
                )}
              </div>

              <div>
                <Label htmlFor="programName">Nombre del Programa</Label>
                <Input
                  id="programName"
                  name="programName"
                  type="text"
                  placeholder="Ingeniería en Software"
                  className={touched.programName && errors.programName ? 'border-red-500' : ''}
                  value={localData.programName}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                />
                {touched.programName && errors.programName && (
                  <p className="text-sm text-red-500 mt-1">{errors.programName}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Costo de Matrícula */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Costo de Matrícula
            </CardTitle>
            <CardDescription>
              Costo total del programa (en dólares canadienses o estadounidenses)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="tuitionCost">Costo Total del Programa</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="tuitionCost"
                  name="tuitionCost"
                  type="number"
                  placeholder="25000"
                  className={`pl-10 ${touched.tuitionCost && errors.tuitionCost ? 'border-red-500' : ''}`}
                  value={localData.tuitionCost}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Incluye todas las tarifas académicas del programa completo
              </p>
              {touched.tuitionCost && errors.tuitionCost && (
                <p className="text-sm text-red-500 mt-1">{errors.tuitionCost}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Información adicional */}
        {localData.programType && (
          <Alert className="border-blue-200 bg-blue-50">
            <GraduationCap className="h-4 w-4" />
            <AlertDescription>
              <div className="font-medium text-blue-900 mb-1">
                Información sobre {programTypes.find(p => p.value === localData.programType)?.label}
              </div>
              <div className="text-blue-800 text-sm">
                Este tipo de programa te permitirá trabajar durante los estudios y solicitar un permiso de trabajo post-graduación.
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

export default Step4AcademicProgramOptimized;
