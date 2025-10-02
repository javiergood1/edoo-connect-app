import { useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, ArrowRight, Check } from 'lucide-react';
import useWizardStore from '../../../stores/wizardStore';

const Step6DestinationWithFlags = () => {
  const { formData, setStepData, nextStep } = useWizardStore();
  const stepData = formData.step6 || {};
  
  const [selectedCountry, setSelectedCountry] = useState(stepData.country || '');
  const [errors, setErrors] = useState({});

  // Lista de países con banderas PNG y información adicional
  const countries = useMemo(() => [
    {
      code: 'canada',
      name: 'Canadá',
      flag: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663156038863/UurJDNigMtAqdvrk.png', // 1.png
      description: 'Excelente calidad educativa y oportunidades de inmigración',
      popular: true
    },
    {
      code: 'usa',
      name: 'Estados Unidos',
      flag: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663156038863/RYgBxDDGstfTGeKq.png', // 2.png
      description: 'Universidades de prestigio mundial y diversidad académica',
      popular: true
    },
    {
      code: 'spain',
      name: 'España',
      flag: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663156038863/MscdybtkeCSEERcy.png', // 10.png
      description: 'Rica cultura, historia y excelente calidad de vida',
      popular: true
    },
    {
      code: 'uk',
      name: 'Reino Unido',
      flag: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663156038863/lxktdgSxngwDibIh.png', // 4.png
      description: 'Tradición académica y programas de corta duración',
      popular: true
    },
    {
      code: 'australia',
      name: 'Australia',
      flag: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663156038863/kzDsGMPOJutjXwsW.png', // 3.png
      description: 'Ambiente multicultural y alta calidad de vida',
      popular: true
    },
    {
      code: 'germany',
      name: 'Alemania',
      flag: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663156038863/vMkuusTxyTVkgNsh.png', // 5.png
      description: 'Educación gratuita y fuerte enfoque en ingeniería',
      popular: false
    },
    {
      code: 'newzealand',
      name: 'Nueva Zelandia',
      flag: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663156038863/WcpIXCrmyaYvGcJC.png', // 7.png
      description: 'Naturaleza espectacular y educación de calidad',
      popular: false
    },
    {
      code: 'italy',
      name: 'Italia',
      flag: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663156038863/ekbKmOmzwKGRjDwS.png', // 9.png
      description: 'Arte, historia y gastronomía inigualables',
      popular: false
    },
    {
      code: 'netherlands',
      name: 'Países Bajos',
      flag: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663156038863/zTbUYQukZGlsFiqL.png', // 8.png
      description: 'Programas en inglés y ambiente internacional',
      popular: false
    },
    {
      code: 'france',
      name: 'Francia',
      flag: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663156038863/quanQahBOYccIBNk.png', // 6.png
      description: 'Rica cultura y programas especializados',
      popular: false
    }
  ], []);

  // Separar países populares y otros
  const popularCountries = useMemo(() => countries.filter(c => c.popular), [countries]);
  const otherCountries = useMemo(() => countries.filter(c => !c.popular), [countries]);

  const handleCountrySelect = useCallback((countryCode) => {
    setSelectedCountry(countryCode);
    if (errors.country) {
      setErrors({});
    }
  }, [errors.country]);

  const handleNextStep = useCallback((e) => {
    e.preventDefault();
    if (!selectedCountry) {
      setErrors({ country: 'Por favor selecciona un país de destino' });
      return;
    }
    
    const selectedCountryData = countries.find(c => c.code === selectedCountry);
    setStepData(6, { 
      country: selectedCountry,
      countryName: selectedCountryData?.name,
      countryFlag: selectedCountryData?.flag
    });
    nextStep();
  }, [selectedCountry, countries, setStepData, nextStep]);

  // Componente de botón de país
  const CountryButton = useCallback(({ country, isSelected, onClick }) => (
    <button
      type="button"
      onClick={() => onClick(country.code)}
      className={`
        relative p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 hover:shadow-lg
        ${isSelected 
          ? 'border-blue-500 bg-blue-50 shadow-md' 
          : 'border-gray-200 bg-white hover:border-gray-300'
        }
      `}
    >
      {isSelected && (
        <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full p-1">
          <Check className="h-3 w-3" />
        </div>
      )}
      
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <img 
            src={country.flag} 
            alt={`Bandera de ${country.name}`}
            className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 shadow-sm"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
          <div 
            className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs hidden"
          >
            {country.name.slice(0, 2).toUpperCase()}
          </div>
        </div>
        <div className={`font-semibold text-sm ${isSelected ? 'text-blue-700' : 'text-gray-900'}`}>
          {country.name}
        </div>
        <div className="text-xs text-gray-600 leading-tight">
          {country.description}
        </div>
      </div>
    </button>
  ), []);

  // Memoizar componentes estáticos
  const headerSection = useMemo(() => (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        País de Destino
      </h2>
      <p className="text-gray-600">
        Selecciona el país donde planeas estudiar
      </p>
    </div>
  ), []);

  return (
    <div className="space-y-6">
      {headerSection}

      <form onSubmit={handleNextStep} className="space-y-6">
        {/* Países Populares */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="h-5 w-5 mr-2" />
              Destinos Más Populares
            </CardTitle>
            <CardDescription>
              Los países más elegidos por estudiantes internacionales
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {popularCountries.map((country) => (
                <CountryButton
                  key={country.code}
                  country={country}
                  isSelected={selectedCountry === country.code}
                  onClick={handleCountrySelect}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Otros Países */}
        <Card>
          <CardHeader>
            <CardTitle>Otros Destinos</CardTitle>
            <CardDescription>
              Alternativas excelentes con oportunidades únicas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {otherCountries.map((country) => (
                <CountryButton
                  key={country.code}
                  country={country}
                  isSelected={selectedCountry === country.code}
                  onClick={handleCountrySelect}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Error message */}
        {errors.country && (
          <div className="text-center">
            <p className="text-sm text-red-500">{errors.country}</p>
          </div>
        )}

        {/* Información del país seleccionado */}
        {selectedCountry && (
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center space-x-3">
                <img 
                  src={countries.find(c => c.code === selectedCountry)?.flag}
                  alt={`Bandera de ${countries.find(c => c.code === selectedCountry)?.name}`}
                  className="w-16 h-16 rounded-full object-cover border-2 border-blue-300 shadow-md"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div 
                  className="w-16 h-16 rounded-full bg-blue-200 items-center justify-center text-blue-600 text-sm font-bold hidden"
                >
                  {countries.find(c => c.code === selectedCountry)?.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-blue-900">
                    Has seleccionado: {countries.find(c => c.code === selectedCountry)?.name}
                  </h3>
                  <p className="text-sm text-blue-700">
                    {countries.find(c => c.code === selectedCountry)?.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-end">
          <Button 
            type="submit" 
            className="px-8"
            disabled={!selectedCountry}
          >
            <ArrowRight className="h-4 w-4 mr-2" />
            Siguiente Paso
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Step6DestinationWithFlags;
