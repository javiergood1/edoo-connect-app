import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home } from 'lucide-react';
import useWizardStore from '../../../stores/wizardStore';

const Step8Housing = () => {
  const { formData, setStepData } = useWizardStore();
  const stepData = formData.step8 || {};

  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: stepData,
  });

  const housingType = watch('housingType', stepData.housingType || '');

  const housingOptions = [
    { value: 'dormitory', label: 'Residencia estudiantil', price: '$800-1200/mes' },
    { value: 'shared', label: 'Apartamento compartido', price: '$600-1000/mes' },
    { value: 'individual', label: 'Apartamento individual', price: '$1200-2000/mes' },
    { value: 'homestay', label: 'Homestay (familia local)', price: '$700-1100/mes' },
  ];

  useEffect(() => {
    const subscription = watch((data) => {
      setStepData(8, data);
    });
    return () => subscription.unsubscribe();
  }, [watch, setStepData]);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Tipo de Vivienda</h2>
        <p className="text-gray-600">¿Qué tipo de alojamiento prefieres?</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Home className="h-5 w-5 mr-2" />
            Opciones de Vivienda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={housingType}
            onValueChange={(value) => setValue('housingType', value)}
            className="space-y-4"
          >
            {housingOptions.map((option) => (
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
          <input type="hidden" {...register('housingType', { required: 'Debes seleccionar un tipo de vivienda' })} />
          {errors.housingType && (
            <p className="text-sm text-red-500 mt-2">{errors.housingType.message}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Step8Housing;
