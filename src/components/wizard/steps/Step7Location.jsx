import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import useWizardStore from '../../../stores/wizardStore';

const Step7Location = () => {
  const { formData, setStepData } = useWizardStore();
  const stepData = formData.step7 || {};
  const selectedCountry = formData.step6?.country;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: stepData,
  });

  const state = watch('state', stepData.state || '');
  const city = watch('city', stepData.city || '');

  // Datos simplificados de ubicaciones
  const locationData = {
    canada: {
      states: [
        { value: 'ontario', label: 'Ontario' },
        { value: 'british-columbia', label: 'British Columbia' },
        { value: 'quebec', label: 'Quebec' },
      ],
      cities: {
        ontario: [
          { value: 'toronto', label: 'Toronto' },
          { value: 'ottawa', label: 'Ottawa' },
        ],
        'british-columbia': [
          { value: 'vancouver', label: 'Vancouver' },
          { value: 'victoria', label: 'Victoria' },
        ],
        quebec: [
          { value: 'montreal', label: 'Montreal' },
          { value: 'quebec-city', label: 'Quebec City' },
        ],
      },
    },
    usa: {
      states: [
        { value: 'california', label: 'California' },
        { value: 'new-york', label: 'New York' },
        { value: 'texas', label: 'Texas' },
      ],
      cities: {
        california: [
          { value: 'los-angeles', label: 'Los Angeles' },
          { value: 'san-francisco', label: 'San Francisco' },
        ],
        'new-york': [
          { value: 'new-york-city', label: 'New York City' },
          { value: 'albany', label: 'Albany' },
        ],
        texas: [
          { value: 'houston', label: 'Houston' },
          { value: 'austin', label: 'Austin' },
        ],
      },
    },
    // Agregar más países según sea necesario
  };

  const currentLocationData = locationData[selectedCountry] || { states: [], cities: {} };

  useEffect(() => {
    const subscription = watch((data) => {
      setStepData(7, data);
    });
    return () => subscription.unsubscribe();
  }, [watch, setStepData]);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Ubicación Específica</h2>
        <p className="text-gray-600">
          Selecciona el estado/provincia y ciudad donde estudiarás
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            Ubicación en {formData.step6?.country || 'el país seleccionado'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="state">Estado/Provincia *</Label>
            <Select value={state} onValueChange={(value) => setValue('state', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona estado/provincia" />
              </SelectTrigger>
              <SelectContent>
                {currentLocationData.states.map((stateOption) => (
                  <SelectItem key={stateOption.value} value={stateOption.value}>
                    {stateOption.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input type="hidden" {...register('state', { required: 'Debes seleccionar un estado/provincia' })} />
            {errors.state && (
              <p className="text-sm text-red-500 mt-1">{errors.state.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="city">Ciudad *</Label>
            <Select value={city} onValueChange={(value) => setValue('city', value)} disabled={!state}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona ciudad" />
              </SelectTrigger>
              <SelectContent>
                {(currentLocationData.cities[state] || []).map((cityOption) => (
                  <SelectItem key={cityOption.value} value={cityOption.value}>
                    {cityOption.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input type="hidden" {...register('city', { required: 'Debes seleccionar una ciudad' })} />
            {errors.city && (
              <p className="text-sm text-red-500 mt-1">{errors.city.message}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Step7Location;
