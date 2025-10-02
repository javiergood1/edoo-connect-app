import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Car } from 'lucide-react';
import useWizardStore from '../../../stores/wizardStore';

const Step9Transport = () => {
  const { formData, setStepData } = useWizardStore();
  const stepData = formData.step9 || {};

  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: stepData,
  });

  const transportType = watch('transportType', stepData.transportType || '');

  const transportOptions = [
    { value: 'public', label: 'Transporte público', price: '$80-150/mes' },
    { value: 'bicycle', label: 'Bicicleta', price: '$20-50/mes' },
    { value: 'car', label: 'Auto propio', price: '$300-600/mes' },
    { value: 'walking', label: 'Caminar', price: '$0/mes' },
  ];

  useEffect(() => {
    const subscription = watch((data) => {
      setStepData(9, data);
    });
    return () => subscription.unsubscribe();
  }, [watch, setStepData]);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Transporte</h2>
        <p className="text-gray-600">¿Cómo planeas moverte en tu ciudad de estudios?</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Car className="h-5 w-5 mr-2" />
            Medio de Transporte
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={transportType}
            onValueChange={(value) => setValue('transportType', value)}
            className="space-y-4"
          >
            {transportOptions.map((option) => (
              <div key={option.value} className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor={option.value} className="cursor-pointer">
                    <div className="font-medium">{option.label}</div>
                    <div className="text-sm text-gray-600">{option.price}</div>
                  </Label>
                </div>
              </div>
            ))}
          </RadioGroup>
          <input type="hidden" {...register('transportType', { required: 'Debes seleccionar un medio de transporte' })} />
          {errors.transportType && (
            <p className="text-sm text-red-500 mt-2">{errors.transportType.message}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Step9Transport;
