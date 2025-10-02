import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, ArrowLeft, CreditCard } from 'lucide-react';
import useAuthStore from '../stores/authStore';

const PaymentCancelPage = () => {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
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
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto mb-4 w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-gray-500 text-2xl">⏸</span>
            </div>
            <CardTitle className="text-2xl text-gray-700">Pago Cancelado</CardTitle>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              <p className="text-lg text-gray-600">
                No se preocupe, no se realizó ningún cargo a su tarjeta.
              </p>
              <p className="text-gray-500">
                Puede continuar usando EdooConnect con el plan gratuito o intentar 
                actualizar a Premium cuando esté listo.
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                <h3 className="font-medium text-blue-900 mb-2">
                  ¿Cambió de opinión?
                </h3>
                <p className="text-sm text-blue-800 mb-3">
                  El plan Premium le dará acceso a análisis avanzados y recomendaciones 
                  personalizadas que pueden ahorrarle miles de dólares en su proyecto educativo.
                </p>
                <Link to="/payment">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Actualizar a Premium
                  </Button>
                </Link>
              </div>
              
              <div className="pt-6 space-x-4">
                <Link to="/wizard">
                  <Button>
                    Continuar con Plan Gratuito
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button variant="outline">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Volver al Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentCancelPage;
