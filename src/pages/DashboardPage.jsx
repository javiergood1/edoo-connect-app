import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, Settings, LogOut, Play } from 'lucide-react';
import useAuthStore from '../stores/authStore';

const DashboardPage = () => {
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50">
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
                <LogOut className="h-4 w-4 mr-2" />
                Salir
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">
            Bienvenido a tu panel de control de EdooConnect
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Iniciar Simulación */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Play className="h-5 w-5 mr-2 text-blue-600" />
                Nueva Simulación
              </CardTitle>
              <CardDescription>
                Comienza un nuevo análisis financiero para tu proyecto de estudios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/wizard">
                <Button className="w-full">
                  Iniciar Wizard
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Estado del Usuario */}
          <Card>
            <CardHeader>
              <CardTitle>Tu Plan</CardTitle>
              <CardDescription>
                Estado actual de tu suscripción
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm">
                  <strong>Plan:</strong> {user?.is_premium ? 'Premium' : 'Gratuito'}
                </p>
                <p className="text-sm">
                  <strong>Email:</strong> {user?.email}
                </p>
                {!user?.is_premium && (
                  <Link to="/payment">
                    <Button size="sm" className="mt-2">
                      Actualizar a Premium
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Configuración */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Configuración
              </CardTitle>
              <CardDescription>
                Ajusta tu perfil y preferencias
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Editar Perfil
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Información adicional */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle>¿Cómo funciona EdooConnect?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6 text-sm">
                <div>
                  <h4 className="font-medium mb-2">1. Completa el Wizard</h4>
                  <p className="text-gray-600">
                    Responde 11 pasos con información sobre tu perfil, destino y objetivos académicos.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">2. Obtén tu Análisis</h4>
                  <p className="text-gray-600">
                    Recibe un análisis financiero personalizado con costos detallados y proyecciones.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">3. Planifica tu Futuro</h4>
                  <p className="text-gray-600">
                    Usa las recomendaciones para tomar decisiones informadas sobre tu educación internacional.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
