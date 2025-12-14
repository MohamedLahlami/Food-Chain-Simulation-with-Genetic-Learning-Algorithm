# Reactive AI course project - foodchain ecosystem simulation with a genetic algorithm

## description

I took inspiration for this simulation from lab 8: EvolutionarySteeringBehavior, it uses the same algorthim to "teach" 3 types of animals to steer towards food and away from danger.
The `animal` class is simply the `vehicule` class renamed, with the addition of 2 extra dna parameters.
_The static poison has been removed_, only static food spawns.

### animal types

- Bunny: eats grass (static food)
- Fox: eats bunnies.
- Bear: eats bunnies and foxes.

## DNA parameters

- `dna[0]`: primary force weight
- `dna[1]`: primary perception radius
- `dna[2]`: secondary force weight
- `dna[3]`: secondary perception radius
- `dna[4]`: tertiary force radius
- `dna[5]`: tertiary perception radius

To make the code more modular and consistant, I used a unified dna structure with 6 parameters.
"Primary", "secondary", and "tertiary" refer to different interactions for each animal type, bunnies use `dna[2]` for repulsion from foxes, while bears use it for attraction to foxes.
This is possible because the values of weights of the forces can be positive or negative, allowing for seeking and evading behaviors.

## tuning the hyper-parameters

To get to a game state where a "reasonable" ecosystem can be sustained, I fixed the value for health loss to `0.001` per frame which comes up to `0.06` health lost per second for all animals, and experimented with different values for the initial health and the reproduction rate for each species.
initially, I wanted to make the mutation rate a class variable and tune it for each subclass but decided not to because the reproduction rate achieves the same effect (more or less) and is already a class variable.

this is not an ideal setup, but it allows for testing the genetic algorithm and observing emergent behaviors in the ecosystem.

### random ranges and initial state

we have fixed the random ranges for the dna parameters for each animal type as follows:

| Animal | dna[0]   | dna[1]     | dna[2]       | dna[3]    | dna[4]       | dna[5]    |
| ------ | -------- | ---------- | ------------ | --------- | ------------ | --------- |
| Bunny  | 0.5 -> 2 | 50 -> 150  | -1.5 -> -0.5 | 80 -> 200 | -1.5 -> -0.5 | 80 -> 200 |
| Fox    | 0.5 -> 2 | 50 -> 150  | -2 -> -0.5   | 50 -> 150 | 0            | 0         |
| Bear   | 1 -> 2.5 | 100 -> 300 | 1 -> 3       | 80 -> 300 | 0            | 0         |

### experiment results

After multiple experiments with different initial health and reproduction rates for each animal type, we arrived at a configuration that allows for a somewhat stable ecosystem over a reasonable period of time.
the results for each configuration are averaged over 3 runs, each lasting 2 minutes or until some sort of equilibrium is reached (one or more species go extinct / stable populations).
here is a breakdown of the some of experiments:

| bunnies RR | foxes RR | bears RR | result                     |
| ---------- | -------- | -------- | -------------------------- |
| 0.001      | 0.001    | 0.001    | all populations explode    |
| 0.002      | 0.001    | 0.002   | populations die out slowly                    |
| 0.002      | 0.001    | 0.002   | populations die out slowly                    |
| 0.004      | 0.0008   | 0.0003   | populations die out slowly |
| 0.004      | 0.002    | 0.002    | populations die out slowly |
