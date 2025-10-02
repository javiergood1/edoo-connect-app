import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Globe, 
  ArrowLeft, 
  Download, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Info,
  BarChart3,
  PieChart,
  Calendar
} from 'lucide-react';
import useAuthStore from '../stores/authStore';
import reportsService from '../services/reports';

const ResultsPage = () => {
  const { user } = useAuthStore();
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    loadAnalysis();
  }, []);

  const loadAnalysis = async () => {
    try {
      setIsLoading(true);
      const response = await reportsService.getCurrentAnalysis();
      
      if (response.success) {
        setAnalysis(response.data);
      } else {
        // No hay análisis previo, generar uno nuevo
        await generateNewAnalysis();
      }
    } catch (error) {
      if (error.response?.status === 404) {
        // No hay análisis previo, generar uno nuevo
        await generateNewAnalysis();
      } else {
        setError('Error al cargar el análisis');
        console.error('Error loading analysis:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const generateNewAnalysis = async () => {
    try {
      setIsGenerating(true);
      const response = await reportsService.generateAnalysis();
      
      if (response.success) {
        setAnalysis(response.data);
      } else {
        setError(response.message || 'Error al generar el análisis');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Error al generar el análisis');
      console.error('Error generating analysis:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportPDF = async () => {
    try {
      const response = await reportsService.exportToPDF();
      if (response.success) {
        // TODO: Implementar descarga de PDF
        alert('Función de exportación PDF en desarrollo');
      }
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Error al exportar PDF');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (isLoading || isGenerating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {isGenerating ? 'Generando tu análisis financiero...' : 'Cargando análisis...'}
          </h2>
          <p className="text-gray-600">
            {isGenerating ? 'Esto puede tomar unos segundos' : 'Por favor espera'}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">{error}</p>
            <div className="space-x-2">
              <Button onClick={generateNewAnalysis}>Intentar de Nuevo</Button>
              <Link to="/wizard">
                <Button variant="outline">Volver al Wizard</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
              {user?.is_premium && (
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500">
                  Premium
                </Badge>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Tu Análisis Financiero
            </h1>
            <p className="text-gray-600">
              Análisis completo para {analysis?.costs?.location}
            </p>
          </div>
          <div className="flex space-x-3">
            {user?.is_premium && (
              <Button onClick={handleExportPDF} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Exportar PDF
              </Button>
            )}
            <Button onClick={generateNewAnalysis}>
              <BarChart3 className="h-4 w-4 mr-2" />
              Regenerar Análisis
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Costo Total Anual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(analysis?.costs?.totals?.yearly || 0)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Gastos Mensuales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(analysis?.costs?.totals?.monthly || 0)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Nivel de Riesgo</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge className={getRiskColor(analysis?.summary?.riskLevel)}>
                {analysis?.summary?.riskLevel?.toUpperCase() || 'N/A'}
              </Badge>
              <div className="mt-2">
                <Progress value={analysis?.summary?.riskScore || 0} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Puntuación</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {analysis?.summary?.riskScore || 0}/100
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cost Breakdown */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="h-5 w-5 mr-2" />
              Desglose de Costos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {analysis?.costs?.breakdown && Object.entries(analysis.costs.breakdown).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium capitalize">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </span>
                  <span className="font-bold text-blue-600">
                    {formatCurrency(value)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              Recomendaciones
            </CardTitle>
            <CardDescription>
              {user?.is_premium ? 'Recomendaciones personalizadas completas' : 'Recomendaciones básicas - Actualiza a Premium para más'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(analysis?.recommendations || analysis?.basicRecommendations || []).map((rec, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 border rounded-lg">
                  <div className={`p-1 rounded-full ${
                    rec.priority === 1 ? 'bg-red-100 text-red-600' :
                    rec.priority === 2 ? 'bg-yellow-100 text-yellow-600' :
                    'bg-green-100 text-green-600'
                  }`}>
                    <Info className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{rec.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                    {rec.estimatedSavings && (
                      <p className="text-sm font-medium text-green-600 mt-2">
                        Ahorro estimado: {formatCurrency(Math.abs(rec.estimatedSavings))}
                        {rec.estimatedSavings < 0 && ' (ingreso adicional)'}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Premium Features Teaser */}
        {!user?.is_premium && (
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900">Desbloquea el Análisis Completo</CardTitle>
              <CardDescription className="text-blue-700">
                Obtén proyecciones de flujo de caja, análisis de riesgos detallado y más recomendaciones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-blue-800">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Proyección de flujo de caja de 24 meses
                  </div>
                  <div className="flex items-center text-sm text-blue-800">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Análisis detallado de riesgos financieros
                  </div>
                  <div className="flex items-center text-sm text-blue-800">
                    <Download className="h-4 w-4 mr-2" />
                    Exportación a PDF
                  </div>
                </div>
                <Link to="/payment">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Actualizar a Premium - $25
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Link to="/wizard">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Wizard
            </Button>
          </Link>
          
          <Link to="/dashboard">
            <Button>
              Ir al Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
