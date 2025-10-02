import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Globe, ArrowRight } from 'lucide-react';
import useAuthStore from '../stores/authStore';
import paymentsService from '../services/payments';

const PaymentSuccessPage = () => {
  const { user, refreshUser } = useAuthStore();
  const [searchParams] = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(true);
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [error, setError] = useState(null);

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        setError('ID de sesión no encontrado');
        setIsVerifying(false);
        return;
      }

      try {
        const response = await paymentsService.verifyPayment(sessionId);
        
        if (response.success && response.data.payment_status === 'paid') {
          setPaymentVerified(true);
          // Actualizar información del usuario
          await refreshUser();
        } else {
          setError('El pago no se completó correctamente');
        }
      } catch (error) {
        console.error('Error verificando pago:', error);
        setError('Error al verificar el pago');
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [sessionId, refreshUser]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
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
              {user?.is_premium && (
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Premium
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="text-center">
          <CardHeader>
            {isVerifying ? (
              <>
                <div className="mx-auto mb-4 w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <CardTitle className="text-2xl">Verificando tu pago...</CardTitle>
              </>
            ) : paymentVerified ? (
              <>
                <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-500" />
                <CardTitle className="text-3xl text-green-600">¡Pago Exitoso!</CardTitle>
              </>
            ) : (
              <>
                <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-500 text-2xl">✕</span>
                </div>
                <CardTitle className="text-2xl text-red-600">Error en el Pago</CardTitle>
              </>
            )}
          </CardHeader>
          
          <CardContent>
            {isVerifying ? (
              <p className="text-gray-600">
                Estamos verificando tu pago con Stripe. Esto puede tomar unos segundos...
              </p>
            ) : paymentVerified ? (
              <div className="space-y-4">
                <p className="text-lg text-gray-700">
                  ¡Bienvenido al plan Premium de EdooConnect!
                </p>
                <p className="text-gray-600">
                  Ahora tienes acceso completo a todas las funcionalidades premium:
                </p>
                <ul className="text-left space-y-2 max-w-md mx-auto">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Proyecciones de flujo de caja detalladas
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Recomendaciones personalizadas con IA
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Análisis de riesgos financieros
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Exportación a PDF
                  </li>
                </ul>
                
                <div className="pt-6">
                  <Link to="/wizard">
                    <Button className="bg-green-600 hover:bg-green-700">
                      Continuar con el Análisis Premium
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-gray-700">
                  {error || 'Hubo un problema al procesar tu pago.'}
                </p>
                <p className="text-sm text-gray-600">
                  Si crees que esto es un error, por favor contacta nuestro soporte.
                </p>
                
                <div className="pt-4 space-x-4">
                  <Link to="/payment">
                    <Button variant="outline">
                      Intentar de Nuevo
                    </Button>
                  </Link>
                  <Link to="/dashboard">
                    <Button>
                      Volver al Dashboard
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
