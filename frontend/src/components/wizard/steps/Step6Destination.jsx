import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe } from 'lucide-react';
import useWizardStore from '../../../stores/wizardStore';

const Step6Destination = () => {
  const { formData, setStepData } = useWizardStore();
  const stepData = formData.step6 || {};

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: stepData,
  });

  const country = watch('country', stepData.country || '');

  const countries = [
    { value: 'canada', label: 'Canadá', flag: '🇨🇦' },
    { value: 'australia', label: 'Australia', flag: '🇦🇺' },
    { value: 'usa', label: 'Estados Unidos', flag: '🇺🇸' },
    { value: 'uk', label: 'Reino Unido', flag: '🇬🇧' },
    { value: 'germany', label: 'Alemania', flag: '🇩🇪' },
    { value: 'france', label: 'Francia', flag: '🇫🇷' },
    { value: 'spain', label: 'España', flag: '🇪🇸' },
    { value: 'italy', label: 'Italia', flag: '🇮🇹' },
  ];

  useEffect(() => {
    const subscription = watch((data) => {
      setStepData(6, data);
    });
    return () => subscription.unsubscribe();
  }, [watch, setStepData]);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">País de Destino</h2>
        <p className="text-gray-600">
          Selecciona el país donde planeas estudiar
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="h-5 w-5 mr-2" />
            Destino de Estudios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={country}
            onValueChange={(value) => setValue('country', value)}
            className="grid md:grid-cols-2 gap-4"
          >
            {countries.map((countryOption) => (
              <div key={countryOption.value} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value={countryOption.value} id={countryOption.value} />
                <Label htmlFor={countryOption.value} className="cursor-pointer flex items-center">
                  <span className="text-2xl mr-2">{countryOption.flag}</span>
                  {countryOption.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
          <input type="hidden" {...register('country', { required: 'Debes seleccionar un país' })} />
          {errors.country && (
            <p className="text-sm text-red-500 mt-2">{errors.country.message}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Step6Destination;
