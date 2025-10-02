import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Globe, ArrowLeft, CreditCard } from 'lucide-react';
import useAuthStore from '../stores/authStore';

const PaymentPage = () => {
  const { user, logout } = useAuthStore();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleUpgradeToPremium = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Importar el servicio de pagos dinámicamente
      const { paymentsService } = await import('../services/payments');
      
      // Crear sesión de checkout
      const response = await paymentsService.createCheckoutSession();
      
      if (response.success && response.data.checkout_url) {
        // Redirigir a Stripe Checkout
        window.location.href = response.data.checkout_url;
      } else {
        throw new Error('No se pudo crear la sesión de pago');
      }
    } catch (error) {
      console.error('Error al crear sesión de pago:', error);
      setError(error.message || 'Error al procesar el pago. Inténtalo de nuevo.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Globe className="h-8 w-8 text-blue-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">EdooConnect</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Hola, {user?.name}</span>
              <Button variant="ghost" onClick={logout}>
                Salir
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Desbloquea tu Análisis Completo
          </h1>
          <p className="text-xl text-gray-600">
            Obtén recomendaciones personalizadas y proyecciones detalladas por solo $25
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Plan Gratuito */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Plan Gratuito</CardTitle>
              <div className="text-3xl font-bold text-gray-600">$0</div>
              <CardDescription>Lo que ya tienes</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Wizard de 11 pasos
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Análisis básico de costos
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Estimación general de presupuesto
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Plan Premium */}
          <Card className="border-blue-500 border-2 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                Recomendado
              </span>
            </div>
            <CardHeader>
              <CardTitle className="text-2xl">Plan Premium</CardTitle>
              <div className="text-3xl font-bold text-blue-600">$25</div>
              <CardDescription>Pago único - Acceso completo</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Todo del plan gratuito
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <strong>Proyección de flujo de caja detallada</strong>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <strong>Recomendaciones personalizadas con IA</strong>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <strong>Análisis de riesgos financieros</strong>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <strong>Exportación a PDF</strong>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <strong>Gráficos interactivos avanzados</strong>
                </li>
              </ul>
              
              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                  {error}
                </div>
              )}
              
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                onClick={handleUpgradeToPremium}
                disabled={isLoading}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                {isLoading ? 'Procesando...' : 'Actualizar a Premium - $25'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Testimonios */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Lo que dicen nuestros usuarios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700 mb-2">
                  "EdooConnect me ayudó a planificar mi maestría en Canadá. Las proyecciones fueron muy precisas y me permitieron ahorrar $5,000."
                </p>
                <p className="text-xs text-gray-500">- María González, Estudiante de MBA</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700 mb-2">
                  "El análisis de riesgos me mostró aspectos que no había considerado. Definitivamente vale la pena la inversión."
                </p>
                <p className="text-xs text-gray-500">- Carlos Rodríguez, Ingeniero</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Garantía */}
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="font-medium text-green-900 mb-2">Garantía de Satisfacción</h3>
              <p className="text-sm text-green-800">
                Si no estás completamente satisfecho con tu análisis premium, 
                te devolvemos tu dinero en los primeros 7 días.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Navegación */}
        <div className="flex justify-between mt-8">
          <Link to="/dashboard">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Dashboard
            </Button>
          </Link>
          
          <Link to="/wizard">
            <Button variant="ghost">
              Continuar con Plan Gratuito
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
