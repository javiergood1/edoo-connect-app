import { useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  MapPin, Home, Car, Briefcase, Heart, 
  ArrowRight, Globe, Building, Users 
} from 'lucide-react';
import useWizardStore from '../../../stores/wizardStore';

// Step 6 - Destination
export const Step6DestinationOptimized = () => {
  const { formData, setStepData, nextStep } = useWizardStore();
  const stepData = formData.step6 || {};
  
  const [localData, setLocalData] = useState({
    country: stepData.country || '',
  });
  const [errors, setErrors] = useState({});

  const countries = useMemo(() => [
    { value: 'canada', label: 'Canadá' },
    { value: 'usa', label: 'Estados Unidos' },
    { value: 'australia', label: 'Australia' },
    { value: 'uk', label: 'Reino Unido' },
    { value: 'other', label: 'Otro país' },
  ], []);

  const handleSelectChange = useCallback((value) => {
    setLocalData({ country: value });
    if (errors.country) setErrors({});
  }, [errors.country]);

  const handleNextStep = useCallback((e) => {
    e.preventDefault();
    if (!localData.country) {
      setErrors({ country: 'Selecciona un país de destino' });
      return;
    }
    setStepData(6, localData);
    nextStep();
  }, [localData, setStepData, nextStep]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">País de Destino</h2>
        <p className="text-gray-600">¿A qué país planeas viajar?</p>
      </div>

      <form onSubmit={handleNextStep} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="h-5 w-5 mr-2" />
              Selecciona tu destino
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="country">País de Destino</Label>
            <Select value={localData.country} onValueChange={handleSelectChange}>
              <SelectTrigger className={errors.country ? 'border-red-500' : ''}>
                <SelectValue placeholder="Selecciona un país" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.value} value={country.value}>
                    {country.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.country && <p className="text-sm text-red-500 mt-1">{errors.country}</p>}
          </CardContent>
        </Card>

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

// Step 7 - Location
export const Step7LocationOptimized = () => {
  const { formData, setStepData, nextStep } = useWizardStore();
  const stepData = formData.step7 || {};
  
  const [localData, setLocalData] = useState({
    city: stepData.city || '',
    province: stepData.province || '',
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setLocalData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleNextStep = useCallback((e) => {
    e.preventDefault();
    if (!localData.city) {
      setErrors({ city: 'Ingresa una ciudad' });
      return;
    }
    setStepData(7, localData);
    nextStep();
  }, [localData, setStepData, nextStep]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Ubicación Específica</h2>
        <p className="text-gray-600">¿En qué ciudad planeas vivir?</p>
      </div>

      <form onSubmit={handleNextStep} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Ubicación
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="city">Ciudad</Label>
              <Input
                id="city"
                name="city"
                placeholder="Toronto, Vancouver, Nueva York..."
                value={localData.city}
                onChange={handleInputChange}
                className={errors.city ? 'border-red-500' : ''}
              />
              {errors.city && <p className="text-sm text-red-500 mt-1">{errors.city}</p>}
            </div>
            <div>
              <Label htmlFor="province">Provincia/Estado (Opcional)</Label>
              <Input
                id="province"
                name="province"
                placeholder="Ontario, California..."
                value={localData.province}
                onChange={handleInputChange}
              />
            </div>
          </CardContent>
        </Card>

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

// Step 8 - Housing
export const Step8HousingOptimized = () => {
  const { formData, setStepData, nextStep } = useWizardStore();
  const stepData = formData.step8 || {};
  
  const [localData, setLocalData] = useState({
    housingType: stepData.housingType || '',
  });
  const [errors, setErrors] = useState({});

  const housingTypes = useMemo(() => [
    { value: 'apartment', label: 'Apartamento/Departamento' },
    { value: 'shared', label: 'Vivienda compartida' },
    { value: 'homestay', label: 'Homestay/Casa de familia' },
    { value: 'residence', label: 'Residencia estudiantil' },
    { value: 'house', label: 'Casa completa' },
  ], []);

  const handleRadioChange = useCallback((value) => {
    setLocalData({ housingType: value });
    if (errors.housingType) setErrors({});
  }, [errors.housingType]);

  const handleNextStep = useCallback((e) => {
    e.preventDefault();
    if (!localData.housingType) {
      setErrors({ housingType: 'Selecciona un tipo de vivienda' });
      return;
    }
    setStepData(8, localData);
    nextStep();
  }, [localData, setStepData, nextStep]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Tipo de Vivienda</h2>
        <p className="text-gray-600">¿Qué tipo de alojamiento prefieres?</p>
      </div>

      <form onSubmit={handleNextStep} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Home className="h-5 w-5 mr-2" />
              Preferencia de Vivienda
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={localData.housingType} onValueChange={handleRadioChange} className="space-y-3">
              {housingTypes.map((type) => (
                <div key={type.value} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value={type.value} id={type.value} />
                  <Label htmlFor={type.value} className="flex-1 cursor-pointer">
                    {type.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            {errors.housingType && <p className="text-sm text-red-500 mt-2">{errors.housingType}</p>}
          </CardContent>
        </Card>

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

// Step 9 - Transport
export const Step9TransportOptimized = () => {
  const { formData, setStepData, nextStep } = useWizardStore();
  const stepData = formData.step9 || {};
  
  const [localData, setLocalData] = useState({
    transportPreference: stepData.transportPreference || '',
  });
  const [errors, setErrors] = useState({});

  const transportOptions = useMemo(() => [
    { value: 'public', label: 'Transporte público' },
    { value: 'car', label: 'Auto propio' },
    { value: 'bike', label: 'Bicicleta' },
    { value: 'walking', label: 'Caminar' },
    { value: 'mixed', label: 'Combinación' },
  ], []);

  const handleRadioChange = useCallback((value) => {
    setLocalData({ transportPreference: value });
    if (errors.transportPreference) setErrors({});
  }, [errors.transportPreference]);

  const handleNextStep = useCallback((e) => {
    e.preventDefault();
    if (!localData.transportPreference) {
      setErrors({ transportPreference: 'Selecciona una opción de transporte' });
      return;
    }
    setStepData(9, localData);
    nextStep();
  }, [localData, setStepData, nextStep]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Transporte</h2>
        <p className="text-gray-600">¿Cómo planeas moverte en tu ciudad de destino?</p>
      </div>

      <form onSubmit={handleNextStep} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Car className="h-5 w-5 mr-2" />
              Preferencia de Transporte
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={localData.transportPreference} onValueChange={handleRadioChange} className="space-y-3">
              {transportOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            {errors.transportPreference && <p className="text-sm text-red-500 mt-2">{errors.transportPreference}</p>}
          </CardContent>
        </Card>

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

// Step 10 - Professional Profile
export const Step10ProfessionalProfileOptimized = () => {
  const { formData, setStepData, nextStep } = useWizardStore();
  const stepData = formData.step10 || {};
  
  const [localData, setLocalData] = useState({
    workExperience: stepData.workExperience || '',
    workPlans: stepData.workPlans || '',
  });
  const [errors, setErrors] = useState({});

  const workPlansOptions = useMemo(() => [
    { value: 'no_work', label: 'No trabajar durante los estudios' },
    { value: 'part_time', label: 'Trabajo de medio tiempo' },
    { value: 'full_time', label: 'Trabajo de tiempo completo (después de estudios)' },
    { value: 'internship', label: 'Prácticas profesionales' },
  ], []);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setLocalData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleRadioChange = useCallback((value) => {
    setLocalData(prev => ({ ...prev, workPlans: value }));
    if (errors.workPlans) setErrors(prev => ({ ...prev, workPlans: '' }));
  }, [errors.workPlans]);

  const handleNextStep = useCallback((e) => {
    e.preventDefault();
    if (!localData.workPlans) {
      setErrors({ workPlans: 'Selecciona tus planes de trabajo' });
      return;
    }
    setStepData(10, localData);
    nextStep();
  }, [localData, setStepData, nextStep]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Perfil Profesional</h2>
        <p className="text-gray-600">Información sobre tu experiencia y planes laborales</p>
      </div>

      <form onSubmit={handleNextStep} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Briefcase className="h-5 w-5 mr-2" />
              Experiencia y Planes Laborales
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="workExperience">Años de Experiencia Laboral</Label>
              <Input
                id="workExperience"
                name="workExperience"
                type="number"
                placeholder="5"
                value={localData.workExperience}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <Label>Planes de Trabajo</Label>
              <RadioGroup value={localData.workPlans} onValueChange={handleRadioChange} className="space-y-3 mt-2">
                {workPlansOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              {errors.workPlans && <p className="text-sm text-red-500 mt-2">{errors.workPlans}</p>}
            </div>
          </CardContent>
        </Card>

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

// Step 11 - Spouse Profile (Condicional)
export const Step11SpouseProfileOptimized = () => {
  const { formData, setStepData, nextStep } = useWizardStore();
  const stepData = formData.step11 || {};
  
  const [localData, setLocalData] = useState({
    spouseName: stepData.spouseName || '',
    spouseAge: stepData.spouseAge || '',
    spouseProfession: stepData.spouseProfession || '',
    spouseEducation: stepData.spouseEducation || '',
  });

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setLocalData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleNextStep = useCallback((e) => {
    e.preventDefault();
    setStepData(11, localData);
    nextStep();
  }, [localData, setStepData, nextStep]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Perfil de Pareja</h2>
        <p className="text-gray-600">Información sobre tu pareja (opcional)</p>
      </div>

      <form onSubmit={handleNextStep} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Heart className="h-5 w-5 mr-2" />
              Información de Pareja
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="spouseName">Nombre</Label>
                <Input
                  id="spouseName"
                  name="spouseName"
                  placeholder="Nombre de tu pareja"
                  value={localData.spouseName}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="spouseAge">Edad</Label>
                <Input
                  id="spouseAge"
                  name="spouseAge"
                  type="number"
                  placeholder="30"
                  value={localData.spouseAge}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="spouseProfession">Profesión</Label>
                <Input
                  id="spouseProfession"
                  name="spouseProfession"
                  placeholder="Profesión actual"
                  value={localData.spouseProfession}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="spouseEducation">Nivel Educativo</Label>
                <Input
                  id="spouseEducation"
                  name="spouseEducation"
                  placeholder="Bachillerato, Universidad..."
                  value={localData.spouseEducation}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" className="px-8">
            <ArrowRight className="h-4 w-4 mr-2" />
            Finalizar Wizard
          </Button>
        </div>
      </form>
    </div>
  );
};
