// Parámetros del algoritmo GRASP
const maxIterations = 20; // Reducido de 100 a 20
const alpha = 0.3; // Factor de relajación para la lista RCL
const maxLocalSearchSteps = 100; // Límite de pasos en búsqueda local

// Calcula la ratio valor/peso para cada item
function calculateRatios(items, capacity) {
    if (!items || !capacity) {
        throw new Error("Items y capacity deben estar definidos");
    }
    return items.map((item, index) => ({
        index,
        ratio: item.value / item.weight,
        weight: item.weight,
        value: item.value,
    }));
}

// Construye la Lista de Candidatos Restringida (RCL)
function buildRCL(candidates, currentWeight, capacity) {
    const feasibleItems = candidates.filter(
        (item) => currentWeight + item.weight <= capacity
    );

    if (feasibleItems.length === 0) return [];

    feasibleItems.sort((a, b) => b.ratio - a.ratio);

    const maxRatio = feasibleItems[0].ratio;
    const minRatio = feasibleItems[feasibleItems.length - 1].ratio;
    const threshold = maxRatio - alpha * (maxRatio - minRatio);

    return feasibleItems.filter((item) => item.ratio >= threshold);
}

// Fase constructiva: construye una solución inicial de manera golosa aleatorizada
function constructivePhase(items, capacity) {
    const solution = new Array(items.length).fill(0);
    let currentWeight = 0;
    let candidates = calculateRatios(items, capacity);
    let remainingCandidates = [...candidates];

    while (remainingCandidates.length > 0) {
        const rcl = buildRCL(remainingCandidates, currentWeight, capacity);
        if (rcl.length === 0) break;

        const selectedIndex = Math.floor(Math.random() * rcl.length);
        const selectedItem = rcl[selectedIndex];

        solution[selectedItem.index] = 1;
        currentWeight += selectedItem.weight;

        remainingCandidates = remainingCandidates.filter(
            (item) => item.index !== selectedItem.index
        );
    }

    return solution;
}

// Evalúa una solución
function evaluateSolution(solution, items, capacity) {
    let totalWeight = 0;
    let totalValue = 0;

    for (let i = 0; i < solution.length; i++) {
        if (solution[i] === 1) {
            totalWeight += items[i].weight;
            totalValue += items[i].value;
        }
    }

    return totalWeight <= capacity ? totalValue : 0;
}

// Fase de búsqueda local optimizada
function localSearch(solution, items, capacity) {
    let improved = true;
    let bestSolution = [...solution];
    let bestValue = evaluateSolution(solution, items, capacity);
    let steps = 0;

    while (improved && steps < maxLocalSearchSteps) {
        improved = false;
        steps++;

        for (let attempt = 0; attempt < 20; attempt++) {
            const i = Math.floor(Math.random() * solution.length);
            const j = Math.floor(Math.random() * solution.length);

            if (i === j) continue;

            const newSolution = [...bestSolution];
            newSolution[i] = 1 - newSolution[i];
            newSolution[j] = 1 - newSolution[j];

            const newValue = evaluateSolution(newSolution, items, capacity);

            if (newValue > bestValue) {
                bestSolution = newSolution;
                bestValue = newValue;
                improved = true;
                break;
            }
        }
    }

    return bestSolution;
}

// Algoritmo GRASP principal
function graspAlgorithm(items, capacity) {
    let bestSolution = null;
    let bestValue = 0;

    for (let i = 0; i < maxIterations; i++) {
        const initialSolution = constructivePhase(items, capacity);
        const improvedSolution = localSearch(initialSolution, items, capacity);
        const currentValue = evaluateSolution(improvedSolution, items, capacity);

        if (currentValue > bestValue) {
            bestSolution = improvedSolution;
            bestValue = currentValue;
        }
    }

    return {
        solution: bestSolution,
        value: bestValue,
    };
}

export {graspAlgorithm}
