import { useState } from 'react'
import { geneticAlgorithm } from './functions/geneticAlgorithm'
import { graspAlgorithm } from './functions/graspAlgorithm'

const items = [
    { weight: 5, value: 50 },
    { weight: 20, value: 100 },
    { weight: 10, value: 60 },
    { weight: 15, value: 80 },
    { weight: 7, value: 40 },
];
const capacity = 30;
const populationSize = 10;
const generations = 50;
const mutationRate = 0.2;

const generateItems = (size) =>
    Array.from({ length: size }, () => ({
        weight: Math.floor(Math.random() * 30) + 1,
        value: Math.floor(Math.random() * 200) + 50,
    }));

const measurePerformance = (algorithm, items, capacity, runs = 5) => {
    let totalTime = 0;
    let bestValue = 0;

    for (let i = 0; i < runs; i++) {
        const start = performance.now();
        const solution = algorithm(items, capacity);
        const end = performance.now();
        totalTime += end - start;

        const totalValue = solution.solution.reduce((sum, selected, index) => {
            if (selected) return sum + items[index].value;
            return sum;
        }, 0);

        if (totalValue > bestValue) bestValue = totalValue;
    }

    return {
        avgTime: (totalTime / runs).toFixed(2),
        bestValue,
    };
};

const App = () => {
    const [result, setResult] = useState(null)
    const [comparison, setComparison] = useState(null)
    const [compareItems, setCompareItems] = useState()

    const handleComparison = () => {
        const items = generateItems(compareItems)
        const graspResults = measurePerformance(graspAlgorithm, items, capacity)
        const geneticResults = measurePerformance(
            (items, capacity) => geneticAlgorithm(items, capacity, populationSize, generations, mutationRate),
            items,
            capacity
        );

        setComparison({
            itemsCount: items.length,
            grasp: graspResults,
            genetic: geneticResults,
        });
    };

    const handleRunGRASP = () => {
        const solution = graspAlgorithm(items, capacity);

        let totalWeight = 0;
        let totalValue = 0;

        const selectedItems = solution.solution.map((selected, index) => {
            if (selected === 1) {
                const item = items[index];
                totalWeight += item.weight;
                totalValue += item.value;
                return {
                    index: index + 1,
                    weight: item.weight,
                    value: item.value,
                    ratio: (item.value / item.weight).toFixed(2),
                };
            }
            return null;
        }).filter(Boolean);

        setResult({
            solution: solution.solution,
            totalValue,
            totalWeight,
            selectedItems,
            ratioUtilization: ((totalWeight / capacity) * 100).toFixed(2),
            efficiency: (totalValue / capacity).toFixed(2),
        });
    };

    const handleRunAlgorithm = () => {
        const solution = geneticAlgorithm(items, capacity, populationSize, generations, mutationRate)
        let totalWeight = 0
        let totalValue = 0

        const selectedItems = solution.solution
            .map((selected, index) => {
                if (selected === 1) {
                    const item = items[index]
                    totalWeight += item.weight
                    totalValue += item.value
                    return {
                        index: index + 1,
                        weight: item.weight,
                        value: item.value,
                        ratio: (item.value / item.weight).toFixed(2),
                    };
                }
                return null
            })
            .filter(Boolean)

        setResult({
            solution: solution.solution,
            totalValue,
            totalWeight,
            selectedItems,
            ratioUtilization: ((totalWeight / capacity) * 100).toFixed(2),
            efficiency: (totalValue / capacity).toFixed(2),
        })
    }

    return (
        <main className='flex w-full h-screen justify-center items-center bg-stone-50'>
            <div className='flex w-full h-full rounded-xl text-lg'>
                <section className='w-3/5 flex flex-col gap-5 p-8 h-full overflow-y-auto'>
                    <h1 className='text-4xl font-semibold'>Análisis Comparativo: GRASP vs Algoritmo Genético </h1>
                    <div className='flex flex-col gap-3'>
                        <h2 className='text-2xl font-semibold'>
                        Problema de la Mochila (Knapsack Problem)
                        </h2>
                        <span>
                            Este repositorio contiene una implementación y análisis comparativo de dos metaheurísticas
                            aplicadas al problema de la mochila</span>

                        <div className='flex gap-6'>
                            <input className='w-72 p-2 rounded-lg border-1 border-solid border-purple-500 mr-3'
                                   placeholder='Numero de items a comparar'
                                   value={compareItems}
                                   onChange={(e) => setCompareItems(e.target.value)}/>
                            <button
                                className='py-2 px-4 bg-purple-500 w-32 text-white font-medium rounded-lg hover:bg-purple-600'
                                onClick={handleComparison}
                            >
                                Compare
                            </button>
                            <button
                                className='py-2 px-4 bg-green-500 w-32 text-white font-medium rounded-lg hover:bg-green-600'
                                onClick={handleRunAlgorithm}>Genetic
                            </button>
                            <button
                                className='py-2 px-4 bg-blue-500 w-32 text-white font-medium rounded-lg hover:bg-blue-600'
                                onClick={handleRunGRASP}>GRASP
                            </button>
                        </div>

                    </div>
                    <div className='flex flex-col gap-3'>
                        <h3 className='text-xl font-semibold'>Complejidad Algorítmica</h3>
                        <span className='font-semibold'>GRASP</span>
                        <div className='flex flex-col ps-6'>
                            <li>Fase Constructiva: O(n log n) debido al ordenamiento inicial por ratio valor/peso</li>
                            <li>Fase de Búsqueda Local: O(n²) en el peor caso al examinar pares de elementos</li>
                            <li>Complejidad Total: O(n²) por iteración</li>
                            <li>Espacio: O(n) para almacenar la solución y la lista RCL</li>
                        </div>
                        <span className='font-semibold'>Algoritmo Genético</span>
                        <div className='flex flex-col ps-6'>
                            <li>Evaluación de Fitness: O(n) por individuo</li>
                            <li>Selección: O(k) donde k es el tamaño del torneo</li>
                            <li>Cruce y Mutación: O(n) por individuo</li>
                            <li>Complejidad Total: O(g × p × n) donde:</li>
                            <li>g = número de generaciones</li>
                            <li>p = tamaño de la población</li>
                            <li>n = número de items</li>
                            <li>Espacio: O(p × n) para almacenar la población</li>
                        </div>
                    </div>
                    <div>
                        <h3 className='text-xl font-semibold mb-3'>Experimentos realizados</h3>
                        <div className='flex flex-col ps-6'>
                            <li>Tamaños probados: 50, 100, 200 y 500 items</li>
                            <li>Múltiples ejecuciones por tamaño</li>
                            <li>Medición de tiempo y calidad de solución</li>
                        </div>
                    </div>
                        <div>
                            <h3 className='text-xl font-semibold mb-3'>Calidad de las Soluciones</h3>
                            <div className='flex flex-col ps-6'>
                                <li>GRASP consistentemente encuentra mejores soluciones</li>
                                <li>Mejora de <span className="highlight">1.2x a 1.4x</span> en valor respecto al
                                    genético
                                </li>
                                <li>GRASP ganó en calidad en todos los tamaños probados</li>
                            </div>
                        </div>

                    <div>
                        <h3 className='text-xl font-semibold mb-3'>Tiempo de Ejecución</h3>
                        <p className='mb-3'>Problemas pequeños (50-100 items):</p>
                        <div className='flex flex-col ps-6'>
                            <li>GRASP es más rápido</li>
                            <li>Hasta 2.8x más rápido en instancias pequeñas</li>
                        </div>
                        <p className='my-3'>Problemas grandes (200-500 items):</p>
                        <div className='flex flex-col ps-6'>
                            <li>El genético es más rápido</li>
                            <li>Hasta 5.1x más rápido en instancias grandes</li>
                        </div>
                        </div>

                        <div>
                            <h3 className='text-xl font-semibold mb-3'>Escalabilidad</h3>
                            <p className='mb-2'>Al aumentar el tamaño del problema 10 veces (50 a 500 items):</p>
                            <div className='flex flex-col ps-6'>
                                <li>Tiempo Genético: aumentó 8.2x(casi
                                    lineal)
                                </li>
                                <li>Tiempo GRASP: aumentó117.6x (más que
                                    cuadrático)
                                </li>
                            </div>
                        </div>

                    <div>
                        <h3 className='text-xl font-semibold mb-3'>Trade-offs y Conclusiones</h3>
                        <p className='mb-3'>GRASP</p>
                        <div className='flex flex-col ps-6'>
                            <li>✅ Mejor calidad de soluciones</li>
                            <li>✅ Más rápido en problemas pequeños</li>
                            <li>❌ Escalabilidad limitada</li>
                            <li>❌ Tiempo crece cuadráticamente</li>
                        </div>


                        <p className='my-3'>Algoritmo Genético</p>
                        <div className='flex flex-col ps-6'>
                            <li>✅ Mejor escalabilidad</li>
                            <li>✅ Más rápido en problemas grandes</li>
                            <li>❌ Soluciones de menor calidad</li>
                            <li>❌ Requiere más memoria</li>
                        </div>
                    </div>

                    <div>
                        <h3 className='text-xl font-semibold mb-3'>Recomendaciones de Uso</h3>
                        <p className='mb-3'>Usar GRASP cuando:</p>
                        <div className='flex flex-col ps-6'>
                            <li>La calidad de la solución es crítica</li>
                            <li>El tamaño del problema es pequeño-mediano (menores a 200 items)</li>
                            <li>El tiempo de ejecución no es crítico</li>
                        </div>
                        <p className='my-3'>Usar Algoritmo Genético cuando:</p>
                        <div className='flex flex-col ps-6'>
                            <li>El tiempo de ejecución es crítico</li>
                            <li>El tamaño del problema es grande (mayores a 200 items)</li>
                            <li>Se pueden aceptar soluciones sub-óptimas</li>
                        </div>
                    </div>
                </section>
                <section className='w-2/5 flex flex-col h-full p-8'>
                    {result && (
                        <div>
                        <h2 className='mb-3'>🧬 SOLUCIÓN ENCONTRADA:</h2>
                            <p>Vector solución: [{result.solution.join(', ')}]</p>

                            <h3 className='my-3'>📦 ITEMS SELECCIONADOS:</h3>
                            {result.selectedItems.map(item => (
                                <div className='flex gap-3' key={item.index}>
                                    <p>Item {item.index}:</p>
                                    <p>  Peso: {item.weight} kg</p>
                                    <p>  Valor: {item.value} $</p>
                                    <p>  Ratio: {item.ratio} $/kg</p>
                                </div>
                            ))}

                            <h3 className='my-3'>📊 RESUMEN:</h3>
                            <p>Peso total: {result.totalWeight}/{capacity} kg</p>
                            <p>Valor total: {result.totalValue} $</p>
                            <p>Ratio de utilización: {result.ratioUtilization} %</p>
                            <p>Eficiencia: {result.efficiency} $/kg</p>
                        </div>
                    )}
                    {comparison && (
                        <div className='mt-6'>
                            <h2>COMPARACIÓN</h2>
                            <p>Items: {comparison.itemsCount}</p>
                            <div className='flex gap-10 mt-4'>
                                <div>
                                    <h3>GRASP</h3>
                                    <p>Mejor valor: {comparison.grasp.bestValue} $</p>
                                    <p>Tiempo promedio: {comparison.grasp.avgTime} ms</p>
                                </div>
                                <div>
                                    <h3>Algoritmo Genético</h3>
                                    <p>Mejor valor: {comparison.genetic.bestValue} $</p>
                                    <p>Tiempo promedio: {comparison.genetic.avgTime} ms</p>
                                </div>
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
};

export default App;
