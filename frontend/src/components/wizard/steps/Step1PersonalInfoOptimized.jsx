import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, Calendar, Briefcase } from 'lucide-react';
import useWizardStore from '../../../stores/wizardStore';

const Step1PersonalInfoOptimized = () => {
  const { formData, setStepData } = useWizardStore();
  const stepData = formData.step1 || {};

  // Estado local para evitar re-renders innecesarios
  const [localData, setLocalData] = useState({
    name: stepData.name || '',
    email: stepData.email || '',
    age: stepData.age || '',
    profession: stepData.profession || '',
    speaking: stepData.speaking || 5,
    reading: stepData.reading || 5,
    listening: stepData.listening || 5,
    writing: stepData.writing || 5,
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  
  // Ref para el debounce
  const debounceRef = useRef(null);

  // Función de debounce para guardado automático
  const debouncedSave = useCallback((data) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(() => {
      setStepData(1, data);
    }, 1000); // 1 segundo de debounce
  }, [setStepData]);

  // Memoizar el cálculo del nivel promedio
  const languageStats = useMemo(() => {
    const { speaking, reading, listening, writing } = localData;
    const average = Math.round((speaking + reading + listening + writing) / 4);
    const level = average <= 3 ? 'Básico' : average <= 6 ? 'Intermedio' : 'Avanzado';
    return { average, level };
  }, [localData.speaking, localData.reading, localData.listening, localData.writing]);

  // Función de validación
  const validateField = useCallback((name, value) => {
    switch (name) {
      case 'name':
        return value.length < 2 ? 'El nombre debe tener al menos 2 caracteres' : '';
      case 'email':
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        return !emailRegex.test(value) ? 'Correo electrónico inválido' : '';
      case 'age':
        const age = parseInt(value);
        if (isNaN(age)) return 'La edad debe ser un número';
        if (age < 16) return 'Edad mínima 16 años';
        if (age > 65) return 'Edad máxima 65 años';
        return '';
      case 'profession':
        return value.length < 2 ? 'La profesión es requerida' : '';
      default:
        return '';
    }
  }, []);

  // Manejar cambios en campos de texto
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    
    setLocalData(prev => {
      const newData = { ...prev, [name]: value };
      debouncedSave(newData);
      return newData;
    });
  }, [debouncedSave]);

  // Manejar blur para validación
  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  }, [validateField]);

  // Manejar cambios en sliders - optimizado
  const handleSliderChange = useCallback((sliderName) => (value) => {
    setLocalData(prev => {
      const newData = { ...prev, [sliderName]: value[0] };
      debouncedSave(newData);
      return newData;
    });
  }, [debouncedSave]);

  // Memoizar las funciones de los sliders
  const handleSpeakingChange = useMemo(() => handleSliderChange('speaking'), [handleSliderChange]);
  const handleReadingChange = useMemo(() => handleSliderChange('reading'), [handleSliderChange]);
  const handleListeningChange = useMemo(() => handleSliderChange('listening'), [handleSliderChange]);
  const handleWritingChange = useMemo(() => handleSliderChange('writing'), [handleSliderChange]);

  // Manejar envío del formulario
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    
    // Validar todos los campos
    const newErrors = {};
    const requiredFields = ['name', 'email', 'age', 'profession'];
    
    requiredFields.forEach(field => {
      const error = validateField(field, localData[field]);
      if (error) newErrors[field] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched({
        name: true,
        email: true,
        age: true,
        profession: true
      });
      return;
    }

    // Guardar datos finales
    setStepData(1, localData);
  }, [localData, validateField, setStepData]);

  // Limpiar timeout al desmontar
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  // Memoizar componentes estáticos
  const headerSection = useMemo(() => (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Información Básica
      </h2>
      <p className="text-gray-600">
        Cuéntanos un poco sobre ti para personalizar tu análisis
      </p>
    </div>
  ), []);

  const languageSummary = useMemo(() => (
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
  ), [languageStats]);

  return (
    <div className="space-y-6">
      {headerSection}

      <form onSubmit={handleSubmit} className="space-y-6">
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
                  name="name"
                  type="text"
                  placeholder="Tu nombre completo"
                  value={localData.name}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={touched.name && errors.name ? 'border-red-500' : ''}
                />
                {touched.name && errors.name && (
                  <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email">Correo Electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="tu@email.com"
                    className={`pl-10 ${touched.email && errors.email ? 'border-red-500' : ''}`}
                    value={localData.email}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                  />
                </div>
                {touched.email && errors.email && (
                  <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <Label htmlFor="age">Edad</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="age"
                    name="age"
                    type="number"
                    placeholder="25"
                    className={`pl-10 ${touched.age && errors.age ? 'border-red-500' : ''}`}
                    value={localData.age}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                  />
                </div>
                {touched.age && errors.age && (
                  <p className="text-sm text-red-500 mt-1">{errors.age}</p>
                )}
              </div>

              <div>
                <Label htmlFor="profession">Profesión Actual</Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="profession"
                    name="profession"
                    type="text"
                    placeholder="Ingeniero, Médico, Estudiante..."
                    className={`pl-10 ${touched.profession && errors.profession ? 'border-red-500' : ''}`}
                    value={localData.profession}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                  />
                </div>
                {touched.profession && errors.profession && (
                  <p className="text-sm text-red-500 mt-1">{errors.profession}</p>
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
                  Speaking (Hablar): {localData.speaking}/10
                </Label>
                <Slider
                  value={[localData.speaking]}
                  onValueChange={handleSpeakingChange}
                  max={10}
                  min={1}
                  step={1}
                  className="mt-2"
                />
              </div>

              <div>
                <Label className="text-sm font-medium">
                  Reading (Leer): {localData.reading}/10
                </Label>
                <Slider
                  value={[localData.reading]}
                  onValueChange={handleReadingChange}
                  max={10}
                  min={1}
                  step={1}
                  className="mt-2"
                />
              </div>

              <div>
                <Label className="text-sm font-medium">
                  Listening (Escuchar): {localData.listening}/10
                </Label>
                <Slider
                  value={[localData.listening]}
                  onValueChange={handleListeningChange}
                  max={10}
                  min={1}
                  step={1}
                  className="mt-2"
                />
              </div>

              <div>
                <Label className="text-sm font-medium">
                  Writing (Escribir): {localData.writing}/10
                </Label>
                <Slider
                  value={[localData.writing]}
                  onValueChange={handleWritingChange}
                  max={10}
                  min={1}
                  step={1}
                  className="mt-2"
                />
              </div>
            </div>

            {languageSummary}
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

export default Step1PersonalInfoOptimized;
