import { useState } from "react";
import SimulationForm from "@/components/simulation-form";
import SimulationCharts from "@/components/simulation-charts";
import SimulationResults from "@/components/simulation-results";
import logoSipeca from "/logoSipeca.png";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bug, Leaf, DollarSign, BarChart3, Calendar } from "lucide-react";
import { postResults } from "@/lib/queries";
import Loader from "@/components/Loader";

export default function Home() {
  const [stateForm, setStateForm] = useState({ error: false, loading: false });
  const [simulationData, setSimulationData] = useState(null);
  const [generationResults, setGenerationResults] = useState(null);

  const handleFormSubmit = async (data) => {
    console.log(data);
    try {
      setStateForm((prevState) => ({ ...prevState, loading: true }));
      const results = await postResults(data);
      setStateForm((prevState) => ({ ...prevState, loading: false }));
      setSimulationData(data);
      setGenerationResults((prevState) => results);
    } catch (error) {
      console.log(error);
      setStateForm((prevState) => ({ ...prevState, error: true }));
    }
  };

  return (
    <div className=" flex min-h-full">
      <main className="container mx-auto py-6 px-4 ">
        <div className="flex justify-center">
          <h1 className="text-3xl font-bold text-center flex  mb-8">
            <img src={logoSipeca} className="h-40 w-40" alt="Logo de Sipeca" />
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Parámetros de Simulación</CardTitle>
                <CardDescription>
                  Configura los parámetros de entrada para la simulación de la
                  temporada.{" "}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SimulationForm
                  onSubmit={handleFormSubmit}
                  loading={stateForm.loading}
                />
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            {stateForm.loading ? (
              <Loader />
            ) : simulationData && generationResults ? (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Análisis
                    </CardTitle>
                    <CardDescription>
                      <div className="space-y-1">
                        {simulationData.aplicarQuimicos ? (
                          <div>Tratamiento quimico aplicado</div>
                        ) : (
                          <div>Tratamiento quimico NO aplicado</div>
                        )}

                        {simulationData.aplicarFeromonas ? (
                          <div>Tratamiento con feromonas aplicado</div>
                        ) : (
                          <div>Tratamiento con feromonas NO aplicado</div>
                        )}
                        <div className="flex items-center gap-4 text-sm">
                          <span>
                            🕒 Duración total: {generationResults.diasTotales}{" "}
                            días
                          </span>
                          <span>
                            🐛 {generationResults.generacionesTotales}{" "}
                            generaciones
                          </span>
                          {generationResults.resultadosPorGeneracion.map(
                            (res, i) => (
                              <span key={i}>
                                📊 Gen {i+1}: {res.dias}d
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="pears">
                      <TabsList className=" flex justify-center mx-auto mb-4">
                      <div className="flex justify-between">
                        <TabsTrigger
                          value="pears"
                          className="flex items-center gap-2"
                        >
                          {/* For medium screens and up */}
                          <div className="hidden md:flex items-center gap-2">
                            <Leaf className="h-4 w-4" />
                            Peras por Generación
                          </div>

                          {/* For small screens */}
                          <div className="flex md:hidden">
                            <Leaf className="h-4 w-4" />
                          </div>
                        </TabsTrigger>
                        <TabsTrigger
                          value="hectares"
                          className="flex items-center gap-2"
                        >
                          <div className="hidden md:flex items-center gap-2">
                            <Bug className="h-4 w-4" /> Infección por Generación
                          </div>
                          <div className="flex md:hidden">
                            <Bug className="h-4 w-4" />
                          </div>
                        </TabsTrigger>
                        <TabsTrigger
                          value="money"
                          className="flex items-center gap-2"
                        >
                          <div className="hidden md:flex items-center gap-2">
                            <DollarSign className="h-4 w-4" /> Economía por
                            Generación
                          </div>
                          <div className=" flex md:hidden ">
                            <DollarSign className="h-4 w-4" />
                          </div>
                        </TabsTrigger>
                        </div>
                      </TabsList>

                      <TabsContent value="pears">
                        <SimulationCharts
                          type="pears"
                          generationResults={generationResults}
                        />
                      </TabsContent>

                      <TabsContent value="hectares">
                        <SimulationCharts
                          type="hectares"
                          generationResults={generationResults}
                        />
                      </TabsContent>
                         
                      <TabsContent value="money">
                        <SimulationCharts
                          type="money"
                          generationResults={generationResults}
                        />
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>

                {
                  <Card>
                    <CardHeader>
                      <CardTitle>Resultados Finales</CardTitle>
                      <CardDescription>
                        Daños causados por 3 generaciones de Carpocapsa en{" "}
                        {generationResults.diasTotales} días. Excluyendo el
                        estado inicial
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <SimulationResults
                        currentResults={generationResults}
                        simulationData={simulationData}
                      />
                    </CardContent>
                  </Card>
                }
              </div>
            ) : (
              <Card className="h-full flex items-center justify-center">
                <CardContent className="pt-6 text-center">
                  <BarChart3 className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-medium">
                    Configure los parámetros
                  </h3>
                  <p className="text-muted-foreground mt-2">
                    Complete el formulario para obtener los resultados de la
                    simulación.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
