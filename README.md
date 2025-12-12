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

To get to a game state where a "reasonable" ecosystem can be sustained, I fixed the value for health loss to `0.002` per frame which comes up to `0.12` health lost per second, and experimented with different values for the initial health and the reproduction rate for each species.
initially, I wanted to make the mutation rate a class variable and tune it for each subclass but decided not to because the reproduction rate achieves the same effect (more or less) and is already a class variable.

here is a breakdown of the some of experiments:

| bunnies health | foxes health | bears health | bunnies RR | foxes RR | bears RR | result after 2 minutes |
| -------------- | ------------ | ------------ | ---------- | -------- | -------- | ---------------------- |
| 1              | 1            | 1            | Data 2     | Data 1   | Data 2   | Data 2                 |
| 0.5            | 0.75         | 1            | Data 2     | Data 1   | Data 2   | Data 2                 |
| 0.5            | 0.75         | 1            | Data 2     | Data 1   | Data 2   | Data 2                 |
| 0.5            | 0.75         | 1            | Data 2     | Data 1   | Data 2   | Data 2                 |
| 0.5            | 0.75         | 1            | Data 2     | Data 1   | Data 2   | Data 2                 |
