import { useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DollarSign, PiggyBank, CreditCard, ArrowRight } from 'lucide-react';
import useWizardStore from '../../../stores/wizardStore';

const Step5FinancesOptimized = () => {
  const { formData, setStepData, nextStep } = useWizardStore();
  const stepData = formData.step5 || {};

  // Estado local sin autoguardado
  const [localData, setLocalData] = useState({
    currentSavings: stepData.currentSavings || '',
    monthlyIncome: stepData.monthlyIncome || '',
    monthlyExpenses: stepData.monthlyExpenses || '',
    fundingSource: stepData.fundingSource || '',
    additionalFunding: stepData.additionalFunding || '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Opciones de fuentes de financiamiento
  const fundingSources = useMemo(() => [
    { value: 'personal_savings', label: 'Ahorros personales' },
    { value: 'family_support', label: 'Apoyo familiar' },
    { value: 'education_loan', label: 'Préstamo educativo' },
    { value: 'scholarship', label: 'Beca o ayuda financiera' },
    { value: 'work_income', label: 'Ingresos por trabajo' },
    { value: 'mixed', label: 'Combinación de fuentes' },
  ], []);

  // Función de validación
  const validateField = useCallback((name, value) => {
    switch (name) {
      case 'currentSavings':
        const savings = parseFloat(value);
        if (isNaN(savings) || savings < 0) return 'Los ahorros deben ser un número válido';
        return '';
      case 'monthlyIncome':
        const income = parseFloat(value);
        if (isNaN(income) || income < 0) return 'Los ingresos deben ser un número válido';
        return '';
      case 'monthlyExpenses':
        const expenses = parseFloat(value);
        if (isNaN(expenses) || expenses < 0) return 'Los gastos deben ser un número válido';
        return '';
      case 'fundingSource':
        return !value ? 'Selecciona una fuente de financiamiento' : '';
      default:
        return '';
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
    
    // Validar campos requeridos
    const newErrors = {};
    const requiredFields = ['currentSavings', 'monthlyIncome', 'monthlyExpenses', 'fundingSource'];
    
    requiredFields.forEach(field => {
      const error = validateField(field, localData[field]);
      if (error) newErrors[field] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched({
        currentSavings: true,
        monthlyIncome: true,
        monthlyExpenses: true,
        fundingSource: true,
      });
      return;
    }

    // Guardar datos y avanzar al siguiente paso
    setStepData(5, localData);
    nextStep();
  }, [localData, validateField, setStepData, nextStep]);

  // Calcular capacidad de ahorro mensual
  const monthlySavings = useMemo(() => {
    const income = parseFloat(localData.monthlyIncome) || 0;
    const expenses = parseFloat(localData.monthlyExpenses) || 0;
    return Math.max(0, income - expenses);
  }, [localData.monthlyIncome, localData.monthlyExpenses]);

  // Memoizar componentes estáticos
  const headerSection = useMemo(() => (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Situación Financiera
      </h2>
      <p className="text-gray-600">
        Información sobre tus recursos financieros disponibles
      </p>
    </div>
  ), []);

  return (
    <div className="space-y-6">
      {headerSection}

      <form onSubmit={handleNextStep} className="space-y-6">
        {/* Recursos Actuales */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PiggyBank className="h-5 w-5 mr-2" />
              Recursos Financieros Actuales
            </CardTitle>
            <CardDescription>
              Información sobre tus ahorros e ingresos actuales
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="currentSavings">Ahorros Actuales (USD)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="currentSavings"
                    name="currentSavings"
                    type="number"
                    placeholder="15000"
                    className={`pl-10 ${touched.currentSavings && errors.currentSavings ? 'border-red-500' : ''}`}
                    value={localData.currentSavings}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                  />
                </div>
                {touched.currentSavings && errors.currentSavings && (
                  <p className="text-sm text-red-500 mt-1">{errors.currentSavings}</p>
                )}
              </div>

              <div>
                <Label htmlFor="monthlyIncome">Ingresos Mensuales (USD)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="monthlyIncome"
                    name="monthlyIncome"
                    type="number"
                    placeholder="3000"
                    className={`pl-10 ${touched.monthlyIncome && errors.monthlyIncome ? 'border-red-500' : ''}`}
                    value={localData.monthlyIncome}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                  />
                </div>
                {touched.monthlyIncome && errors.monthlyIncome && (
                  <p className="text-sm text-red-500 mt-1">{errors.monthlyIncome}</p>
                )}
              </div>

              <div>
                <Label htmlFor="monthlyExpenses">Gastos Mensuales (USD)</Label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="monthlyExpenses"
                    name="monthlyExpenses"
                    type="number"
                    placeholder="2000"
                    className={`pl-10 ${touched.monthlyExpenses && errors.monthlyExpenses ? 'border-red-500' : ''}`}
                    value={localData.monthlyExpenses}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                  />
                </div>
                {touched.monthlyExpenses && errors.monthlyExpenses && (
                  <p className="text-sm text-red-500 mt-1">{errors.monthlyExpenses}</p>
                )}
              </div>

              <div>
                <Label htmlFor="fundingSource">Fuente Principal de Financiamiento</Label>
                <Select
                  value={localData.fundingSource}
                  onValueChange={handleSelectChange('fundingSource')}
                >
                  <SelectTrigger className={touched.fundingSource && errors.fundingSource ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Selecciona una fuente" />
                  </SelectTrigger>
                  <SelectContent>
                    {fundingSources.map((source) => (
                      <SelectItem key={source.value} value={source.value}>
                        {source.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {touched.fundingSource && errors.fundingSource && (
                  <p className="text-sm text-red-500 mt-1">{errors.fundingSource}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="additionalFunding">Financiamiento Adicional (Opcional)</Label>
              <Input
                id="additionalFunding"
                name="additionalFunding"
                type="text"
                placeholder="Describe cualquier fuente adicional de financiamiento..."
                value={localData.additionalFunding}
                onChange={handleInputChange}
              />
            </div>
          </CardContent>
        </Card>

        {/* Resumen Financiero */}
        {monthlySavings > 0 && (
          <Alert className="border-green-200 bg-green-50">
            <PiggyBank className="h-4 w-4" />
            <AlertDescription>
              <div className="font-medium text-green-900 mb-1">
                Capacidad de Ahorro Mensual: ${monthlySavings.toLocaleString()}
              </div>
              <div className="text-green-800 text-sm">
                Con tus ingresos y gastos actuales, puedes ahorrar ${monthlySavings.toLocaleString()} por mes para tu proyecto educativo.
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

export default Step5FinancesOptimized;
