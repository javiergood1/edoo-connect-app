import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import useWizardStore from "../../../stores/wizardStore";
import { HelpCircle } from "lucide-react";
import { useEffect, useState } from "react";

const migrationGoals = [
  {
    id: "solo-estudiar",
    title: "Solo estudiar",
    description: "Mi objetivo principal es estudiar en el extranjero y regresar a mi país de origen al finalizar mis estudios.",
    helpText: {
      title: "Enfoque en el estudio",
      description: "Este objetivo es ideal si buscas una experiencia académica internacional sin planes de residencia a largo plazo. La planificación se centrará en costos educativos, visados de estudiante y seguros de viaje.",
      color: "blue",
      icon: <HelpCircle className="h-4 w-4" />,
    },
  },
  {
    id: "estudiar-y-trabajar",
    title: "Estudiar y trabajar",
    description: "Quiero estudiar en el extranjero y, si es posible, trabajar durante o después de mis estudios para cubrir gastos o ganar experiencia laboral.",
    helpText: {
      title: "Equilibrio estudio-trabajo",
      description: "Este objetivo requiere considerar opciones de visado que permitan trabajar, así como la viabilidad de empleo en el destino elegido. Se analizarán ingresos potenciales y regulaciones laborales.",
      color: "yellow",
      icon: <HelpCircle className="h-4 w-4" />,
    },
  },
  {
    id: "emigrar-permanentemente",
    title: "Emigrar permanentemente",
    description: "Mi intención es estudiar en el extranjero como un camino para establecer mi residencia permanente en ese país.",
    helpText: {
      title: "Visión a largo plazo",
      description: "Este objetivo implica una planificación financiera y migratoria más compleja, incluyendo la evaluación de programas de residencia, requisitos de idioma y oportunidades de empleo post-estudio que faciliten la inmigración.",
      color: "green",
      icon: <HelpCircle className="h-4 w-4" />,
    },
  },
];

const additionalConsiderations = [
  {
    id: "familia",
    title: "Viajo con mi familia (cónyuge, hijos)",
    description: "Esto impactará significativamente los costos de vida, seguros y requisitos de visado.",
  },
  {
    id: "dependientes",
    title: "Tengo dependientes económicos en mi país de origen",
    description: "Necesitaré considerar el envío de remesas y cómo esto afecta mi presupuesto.",
  },
  {
    id: "condicion-medica",
    title: "Tengo una condición médica preexistente",
    description: "Esto podría influir en los costos de seguro médico y la elección del destino.",
  },
  {
    id: "mascota",
    title: "Viajo con mi mascota",
    description: "Implica costos adicionales de transporte, visado y alojamiento.",
  },
];

export function Step2MigrationGoalOptimized() {
  const { formData, setStepData } = useWizardStore();
  const [selectedGoal, setSelectedGoal] = useState(
    formData.migrationGoal || migrationGoals[0].id
  );
  const [selectedConsiderations, setSelectedConsiderations] = useState(
    formData.additionalConsiderations || []
  );

  useEffect(() => {
    setStepData({ migrationGoal: selectedGoal, additionalConsiderations: selectedConsiderations });
  }, [selectedGoal, selectedConsiderations, setStepData]);

  const currentHelpText = migrationGoals.find(
    (goal) => goal.id === selectedGoal
  )?.helpText;

  const handleGoalChange = (value) => {
    setSelectedGoal(value);
  };

  const handleConsiderationChange = (id) => {
    setSelectedConsiderations((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Tu Objetivo de Migración</h2>
        <p className="mt-1 text-sm text-gray-600">
          Selecciona el objetivo que mejor describa tu intención al estudiar en
          el extranjero.
        </p>
      </div>

      <RadioGroup
        onValueChange={handleGoalChange}
        value={selectedGoal}
        className="grid grid-cols-1 gap-4 sm:grid-cols-3"
      >
        {migrationGoals.map((goal) => (
          <div
            key={goal.id}
            className={`relative block cursor-pointer rounded-lg border p-4 shadow-sm focus:outline-none transition-all duration-200
              ${
                selectedGoal === goal.id
                  ? "border-blue-500 ring-2 ring-blue-500" // Selected style
                  : "border-gray-300 hover:border-gray-400" // Default style
              }`}
          >
            <RadioGroupItem id={goal.id} value={goal.id} className="sr-only" />
            <Label htmlFor={goal.id} className="flex flex-col p-4 cursor-pointer">
              <span className="block text-sm font-medium text-gray-900">
                {goal.title}
              </span>
              <span className="mt-1 block text-sm text-gray-500">
                {goal.description}
              </span>
            </Label>
          </div>
        ))}
      </RadioGroup>

      {currentHelpText && (
        <Alert className={`border-${currentHelpText.color}-200 bg-${currentHelpText.color}-50 flex items-start space-x-3`}>
          {currentHelpText.icon}
          <AlertDescription className="flex-1">
            <div className={`font-medium text-${currentHelpText.color}-900 mb-1 w-full`}>
              {currentHelpText.title}
            </div>
            <div className={`text-${currentHelpText.color}-800 text-sm w-full`}>
              {currentHelpText.description}
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900">Consideraciones Adicionales</h3>
        <p className="text-sm text-gray-600">
          Selecciona cualquier factor adicional que deba ser considerado en tu
          planificación.
        </p>
        <div className="space-y-2">
          {additionalConsiderations.map((consideration) => (
            <div key={consideration.id} className="flex items-start space-x-2">
              <Checkbox
                id={consideration.id}
                checked={selectedConsiderations.includes(consideration.id)}
                onCheckedChange={() =>
                  handleConsiderationChange(consideration.id)
                }
              />
              <div className="grid gap-1.5 leading-none">
                <Label
                  htmlFor={consideration.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {consideration.title}
                </Label>
                <p className="text-sm text-gray-500">
                  {consideration.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

