import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, PiggyBank, TrendingUp, CreditCard, Users } from 'lucide-react';
import useWizardStore from '../../../stores/wizardStore';

const Step5Finances = () => {
  const { formData, setStepData } = useWizardStore();
  const stepData = formData.step5 || {};

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: stepData,
  });

  const hasFamilySupport = watch('hasFamilySupport', stepData.hasFamilySupport || false);
  const hasEducationLoan = watch('hasEducationLoan', stepData.hasEducationLoan || false);

  const onSubmit = (data) => {
    setStepData(5, data);
  };

  // Guardar datos automáticamente cuando cambian
  useEffect(() => {
    const subscription = watch((data) => {
      setStepData(5, data);
    });
    return () => subscription.unsubscribe();
  }, [watch, setStepData]);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Situación Financiera</h2>
        <p className="text-gray-600">
          Cuéntanos sobre tus recursos financieros actuales y fuentes de financiamiento
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Recursos Propios */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PiggyBank className="h-5 w-5 mr-2" />
              Recursos Propios
            </CardTitle>
            <CardDescription>
              Información sobre tus ahorros e ingresos actuales
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="savings">Ahorros Personales Disponibles (USD) *</Label>
              <Input
                id="savings"
                type="number"
                min="0"
                placeholder="15000"
                {...register('savings', {
                  required: 'Los ahorros son requeridos',
                  min: {
                    value: 0,
                    message: 'Los ahorros no pueden ser negativos',
                  },
                })}
                className={errors.savings ? 'border-red-500' : ''}
              />
              {errors.savings && (
                <p className="text-sm text-red-500 mt-1">{errors.savings.message}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Cantidad total que tienes disponible para tus estudios
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="monthlyIncome">Ingresos Mensuales Actuales (USD) *</Label>
                <Input
                  id="monthlyIncome"
                  type="number"
                  min="0"
                  placeholder="3000"
                  {...register('monthlyIncome', {
                    required: 'Los ingresos mensuales son requeridos',
                    min: {
                      value: 0,
                      message: 'Los ingresos no pueden ser negativos',
                    },
                  })}
                  className={errors.monthlyIncome ? 'border-red-500' : ''}
                />
                {errors.monthlyIncome && (
                  <p className="text-sm text-red-500 mt-1">{errors.monthlyIncome.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="monthlyExpenses">Gastos Mensuales Actuales (USD) *</Label>
                <Input
                  id="monthlyExpenses"
                  type="number"
                  min="0"
                  placeholder="2000"
                  {...register('monthlyExpenses', {
                    required: 'Los gastos mensuales son requeridos',
                    min: {
                      value: 0,
                      message: 'Los gastos no pueden ser negativos',
                    },
                  })}
                  className={errors.monthlyExpenses ? 'border-red-500' : ''}
                />
                {errors.monthlyExpenses && (
                  <p className="text-sm text-red-500 mt-1">{errors.monthlyExpenses.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fuentes de Financiamiento */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Fuentes de Financiamiento Adicional
            </CardTitle>
            <CardDescription>
              ¿Tienes acceso a otras fuentes de financiamiento?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Apoyo Familiar */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="familySupport"
                  checked={hasFamilySupport}
                  onCheckedChange={(checked) => setValue('hasFamilySupport', checked)}
                />
                <Label htmlFor="familySupport" className="flex items-center cursor-pointer">
                  <Users className="h-4 w-4 mr-2 text-green-600" />
                  Apoyo Familiar
                </Label>
              </div>
              
              {hasFamilySupport && (
                <div className="ml-6">
                  <Label htmlFor="familySupportAmount">Monto Mensual de Apoyo Familiar (USD)</Label>
                  <Input
                    id="familySupportAmount"
                    type="number"
                    min="0"
                    placeholder="500"
                    {...register('familySupportAmount', {
                      required: hasFamilySupport ? 'El monto de apoyo familiar es requerido' : false,
                      min: {
                        value: 0,
                        message: 'El monto no puede ser negativo',
                      },
                    })}
                    className={errors.familySupportAmount ? 'border-red-500' : ''}
                  />
                  {errors.familySupportAmount && (
                    <p className="text-sm text-red-500 mt-1">{errors.familySupportAmount.message}</p>
                  )}
                </div>
              )}
            </div>

            {/* Crédito Educativo */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="educationLoan"
                  checked={hasEducationLoan}
                  onCheckedChange={(checked) => setValue('hasEducationLoan', checked)}
                />
                <Label htmlFor="educationLoan" className="flex items-center cursor-pointer">
                  <CreditCard className="h-4 w-4 mr-2 text-blue-600" />
                  Crédito Educativo
                </Label>
              </div>
              
              {hasEducationLoan && (
                <div className="ml-6">
                  <Label htmlFor="loanAmount">Monto Total del Crédito (USD)</Label>
                  <Input
                    id="loanAmount"
                    type="number"
                    min="0"
                    placeholder="25000"
                    {...register('loanAmount', {
                      required: hasEducationLoan ? 'El monto del crédito es requerido' : false,
                      min: {
                        value: 0,
                        message: 'El monto no puede ser negativo',
                      },
                    })}
                    className={errors.loanAmount ? 'border-red-500' : ''}
                  />
                  {errors.loanAmount && (
                    <p className="text-sm text-red-500 mt-1">{errors.loanAmount.message}</p>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Resumen Financiero */}
        {watch('savings') && watch('monthlyIncome') && watch('monthlyExpenses') && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <h4 className="font-medium text-blue-900 mb-3">Resumen de tu Situación Financiera</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800">
                <div>
                  <p><strong>Ahorros disponibles:</strong> ${parseInt(watch('savings') || 0).toLocaleString()} USD</p>
                  <p><strong>Capacidad de ahorro mensual:</strong> ${Math.max(0, (parseInt(watch('monthlyIncome') || 0) - parseInt(watch('monthlyExpenses') || 0))).toLocaleString()} USD</p>
                </div>
                <div>
                  {hasFamilySupport && (
                    <p><strong>Apoyo familiar mensual:</strong> ${parseInt(watch('familySupportAmount') || 0).toLocaleString()} USD</p>
                  )}
                  {hasEducationLoan && (
                    <p><strong>Crédito educativo:</strong> ${parseInt(watch('loanAmount') || 0).toLocaleString()} USD</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Campos ocultos para los checkboxes */}
        <input type="hidden" {...register('hasFamilySupport')} />
        <input type="hidden" {...register('hasEducationLoan')} />
      </form>
    </div>
  );
};

export default Step5Finances;
