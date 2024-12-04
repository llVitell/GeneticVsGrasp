const calculateFitness = (chromosome, items, capacity) => {
    let totalWeight = 0;
    let totalValue = 0;

    for (let i = 0; i < chromosome.length; i++) {
        if (chromosome[i] === 1) {
            totalWeight += items[i].weight;
            totalValue += items[i].value;
        }
    }

    return totalWeight > capacity ? 0 : totalValue;
};

const generateRandomChromosome = (items) =>
    Array.from({ length: items.length }, () => Math.random() > 0.5 ? 1 : 0);

const select = (population, items, capacity) => {
    const tournamentSize = 3;
    let best = population[Math.floor(Math.random() * population.length)];
    for (let i = 1; i < tournamentSize; i++) {
        const contender = population[Math.floor(Math.random() * population.length)];
        if (calculateFitness(contender, items, capacity) > calculateFitness(best, items, capacity)) {
            best = contender;
        }
    }
    return best;
};

const crossover = (parent1, parent2) => {
    const point = Math.floor(Math.random() * parent1.length);
    const child1 = parent1.slice(0, point).concat(parent2.slice(point));
    const child2 = parent2.slice(0, point).concat(parent1.slice(point));
    return [child1, child2];
};

const mutate = (chromosome, mutationRate) =>
    chromosome.map((gene) => (Math.random() < mutationRate ? 1 - gene : gene));

const geneticAlgorithm = (items, capacity, populationSize, generations, mutationRate) => {
    let population = Array.from({ length: populationSize }, () =>
        generateRandomChromosome(items)
    );

    for (let generation = 0; generation < generations; generation++) {
        population = population.sort(
            (a, b) => calculateFitness(b, items, capacity) - calculateFitness(a, items, capacity)
        );

        const newPopulation = [];

        while (newPopulation.length < populationSize) {
            const parent1 = select(population, items, capacity);
            const parent2 = select(population, items, capacity);

            const [child1, child2] = crossover(parent1, parent2);

            newPopulation.push(mutate(child1, mutationRate));
            if (newPopulation.length < populationSize) {
                newPopulation.push(mutate(child2, mutationRate));
            }
        }

        population = newPopulation;
    }

    population = population.sort(
        (a, b) => calculateFitness(b, items, capacity) - calculateFitness(a, items, capacity)
    );
    const bestSolution = population[0];
    return {
        solution: bestSolution,
        value: calculateFitness(bestSolution, items, capacity),
    };
};

export { geneticAlgorithm };
