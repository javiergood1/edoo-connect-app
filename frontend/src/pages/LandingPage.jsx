import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Globe, Calculator, TrendingUp, Users, Shield } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Globe className="h-8 w-8 text-blue-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">EdooConnect</h1>
            </div>
            <div className="flex space-x-4">
              <Link to="/login">
                <Button variant="ghost">Iniciar Sesión</Button>
              </Link>
              <Link to="/register">
                <Button>Registrarse</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Planifica tu Futuro Académico
              <span className="block text-blue-200">en el Extranjero</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Análisis financiero completo para estudiantes internacionales. 
              Descubre cuánto necesitas para estudiar en tu destino soñado.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                  Comenzar Análisis Gratuito
                </Button>
              </Link>
              <Link to="/wizard">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  Ver Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ¿Por qué elegir EdooConnect?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Nuestra plataforma te ayuda a tomar decisiones informadas sobre tu educación internacional
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Calculator className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Análisis Financiero Detallado</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Calcula todos los costos: matrícula, vivienda, alimentación, transporte y más.
                  Obtén proyecciones precisas para tu presupuesto.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle>Proyecciones Inteligentes</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Visualiza tu flujo de caja mensual y identifica oportunidades de ahorro
                  con nuestro motor de análisis avanzado.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <CardTitle>Recomendaciones Personalizadas</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Recibe consejos específicos basados en tu perfil, destino y objetivos
                  académicos y migratorios.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Planes Diseñados para Ti
            </h2>
            <p className="text-xl text-gray-600">
              Comienza gratis y actualiza cuando necesites el análisis completo
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Plan Gratuito */}
            <Card className="relative">
              <CardHeader>
                <CardTitle className="text-2xl">Plan Gratuito</CardTitle>
                <div className="text-3xl font-bold">$0</div>
                <CardDescription>Perfecto para comenzar tu análisis</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    Análisis básico de costos
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    Wizard de 11 pasos
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    Estimación general de presupuesto
                  </li>
                </ul>
                <Link to="/register" className="block mt-6">
                  <Button className="w-full">Comenzar Gratis</Button>
                </Link>
              </CardContent>
            </Card>

            {/* Plan Premium */}
            <Card className="relative border-blue-500 border-2">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Más Popular
                </span>
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">Plan Premium</CardTitle>
                <div className="text-3xl font-bold">$25</div>
                <CardDescription>Pago único - Análisis completo</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    Todo del plan gratuito
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    Proyección de flujo de caja detallada
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    Recomendaciones personalizadas con IA
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    Análisis de riesgos financieros
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    Exportación a PDF
                  </li>
                </ul>
                <Link to="/register" className="block mt-6">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Obtener Premium
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center mb-8">
            <Globe className="h-8 w-8 text-blue-400 mr-2" />
            <span className="text-2xl font-bold">EdooConnect</span>
          </div>
          <div className="text-center text-gray-400">
            <p>&copy; 2024 EdooConnect. Todos los derechos reservados.</p>
            <p className="mt-2">Ayudando a estudiantes a alcanzar sus sueños académicos internacionales.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
