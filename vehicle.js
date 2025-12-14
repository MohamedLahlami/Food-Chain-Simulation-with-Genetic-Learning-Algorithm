// Daniel Shiffman
// The Coding Train
// Coding Challenge 69: Steering Evolution
// Part 1: https://youtu.be/flxOkx0yLrY
// Part 2: https://youtu.be/XaOVH8ZSRNA
// Part 3: https://youtu.be/vZUWTlK7D2Q
// Part 4: https://youtu.be/ykOcaInciBI
// Part 5: https://youtu.be/VnFF5V5DS8s

// https://editor.p5js.org/codingtrain/sketches/xgQNXkxx1

var mr = 0.01; // mutation rate

// classe vehicule renommée en Animal
class Animal {
  constructor(x, y, dna) {
    // La vie - initialisée par les sous-classes
    // this.health sera défini par Bunny/Fox/Bear

    this.acceleration = createVector(0, 0);
    this.velocity = createVector(0, -2);
    this.position = createVector(x, y);
    this.r = 4;

    // Configurable properties (set by subclasses)
    this.maxspeed = 4; // Default, overridden by children
    this.maxforce = 0.5;
    this.reproductionRate = 0.003; // Default, overridden by children
    this.color = color(255, 255, 255); // Default white
    this.img = null; // Image to display (set by subclasses)

    // 4 gènes : poids de la force d'attraction vers la nourriture,
    //           poids  de la force d'attraction vers le poison,
    //           perception de la nourriture (rayon cercle de détection),
    //           perception du poison (rayon cercle de détection)
    this.dna = [];
    if (dna === undefined) {
      //just for consistency, initialize all 6 genes
      // attraction / repulsion weight for PRIMARY food
      this.dna[0] = random(-2, 2);
      // perception for PRIMARY food
      this.dna[1] = random(0, 100);
      // attraction / repulsion weight for SECONDARY Food / PRIMARY danger
      this.dna[2] = random(-2, 2);
      // Perception for SECONDARY Food / PRIMARY danger
      this.dna[3] = random(0, 100);
      // attraction / repulsion weight for TERTIARY danger
      this.dna[4] = random(-2, 2);
      // Perception for TERTIARY danger
      this.dna[5] = random(0, 100);
    } else {
      // Mutation lors d'un clonage, on va recréer
      // un individu avec des gènes légèrement modifiés
      // Even indices (0,2,4) = weight genes, mutate ±0.1
      // Odd indices (1,3,5) = perception genes, mutate ±10

      this.dna[0] = dna[0];
      if (random(1) < mr) {
        this.dna[0] += random(-0.1, 0.1);
      }
      this.dna[1] = dna[1];
      if (random(1) < mr) {
        this.dna[1] += random(-10, 10);
        this.dna[1] = max(0, this.dna[1]); // Prevent negative perception
      }
      this.dna[2] = dna[2];
      if (random(1) < mr) {
        this.dna[2] += random(-0.1, 0.1);
      }
      this.dna[3] = dna[3];
      if (random(1) < mr) {
        this.dna[3] += random(-10, 10);
        this.dna[3] = max(0, this.dna[3]); // Prevent negative perception
      }
      this.dna[4] = dna[4];
      if (random(1) < mr) {
        this.dna[4] += random(-0.1, 0.1);
      }
      this.dna[5] = dna[5];
      if (random(1) < mr) {
        this.dna[5] += random(-10, 10);
        this.dna[5] = max(0, this.dna[5]); // Prevent negative perception
      }
    }
  }

  // Method to update location
  update() {
    // 60 fois par seconde, on perd de la vie, d'où la
    // nécessité de se nourrir.

    //TODO: experiment
    this.health -= 0.002; // =0.12 par seconde

    // Update velocity
    this.velocity.add(this.acceleration);
    // Limit speed
    this.velocity.limit(this.maxspeed);
    this.position.add(this.velocity);
    // Reset accelerationelertion to 0 each cycle
    this.acceleration.mult(0);
  }

  applyForce(force) {
    this.acceleration.add(force);
  }

  // Méthode abstraite - sera surchargée par les sous-classes
  // Chaque espèce définit son propre comportement
  behaviors() {
    // Les sous-classes doivent surcharger cette méthode
    // pour définir leurs comportements spécifiques
  }

  clone() {
    // Utilise le taux de reproduction configuré par la sous-classe
    // Requiert une santé minimale de 0.7 pour se reproduire (well-fed)
    if (this.health > 0.7 && random(1) < this.reproductionRate) {
      // Coût énergétique de la reproduction
      this.health -= 0.3;
      // Utilise this.constructor pour créer une instance de la bonne sous-classe
      return new this.constructor(this.position.x, this.position.y, this.dna);
    } else {
      return null;
    }
  }

  // Recherche et consommation de nourriture statique (vecteurs)
  // Utilisé pour les herbivores qui mangent de la nourriture fixe
  forage(list, nutrition, perception) {
    let record = Infinity;
    let closest = null;

    // on parcourt la liste des éléments à manger
    // on cherche le plus proche
    for (let i = list.length - 1; i >= 0; i--) {
      const d = this.position.dist(list[i]);

      // si l'élément est à portée (rayon de 5 pixels)
      // on le mange et on gagne de la vie
      if (d < 5) {
        list.splice(i, 1);
        this.health += nutrition;
        this.health = min(this.health, 2.0); // Cap health at 2.0
      } else {
        // si l'élément n'est pas à portée,
        // on cherche le plus proche
        if (d < record && d < perception) {
          // on garde en mémoire la distance et l'élément
          record = d;
          closest = list[i];
        }
      }
    }

    // This is the moment of eating!
    if (closest != null) {
      return this.seek(closest);
    }

    return createVector(0, 0);
  }

  // Chasse et consommation de proies
  hunt(preyList, nutrition, perception) {
    let record = Infinity;
    let closest = null;

    // Parcourt la liste des proies potentielles
    for (let i = preyList.length - 1; i >= 0; i--) {
      const prey = preyList[i];
      const d = this.position.dist(prey.position);

      // Si la proie est à portée d'attaque (rayon de 5 pixels)
      if (d < 5) {
        // Tue la proie et gagne de la vie
        prey.health = 0;
        this.health += nutrition;
        this.health = min(this.health, 2.0); // Cap health at 2.0
      } else {
        // Cherche la proie la plus proche dans le rayon de perception
        if (d < record && d < perception) {
          record = d;
          closest = prey;
        }
      }
    }

    // Poursuit la proie la plus proche
    if (closest != null) {
      return this.seek(closest.position);
    }

    return createVector(0, 0);
  }

  // Trouve l'élément le plus proche dans une liste (helper function)
  // Retourne un vecteur de direction vers le plus proche
  seekClosest(list, perception) {
    let record = Infinity;
    let closest = null;

    for (let animal of list) {
      const d = this.position.dist(animal.position);
      if (d < record && d < perception) {
        record = d;
        closest = animal;
      }
    }

    if (closest != null) {
      return this.seek(closest.position);
    }

    return createVector(0, 0);
  }

  // A method that calculates a steering force towards a target
  // STEER = DESIRED MINUS VELOCITY
  seek(target) {
    const desired = p5.Vector.sub(target, this.position); // A vector pointing from the location to the target

    // Scale to maximum speed
    desired.setMag(this.maxspeed);

    // Steering = Desired minus velocity
    const steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce); // Limit to maximum steering force

    return steer;
    //this.applyForce(steer);
  }

  dead() {
    return this.health <= 0;
  }

  display() {
    // Draw a triangle rotated in the direction of velocity
    const angle = this.velocity.heading() + PI / 2;

    push();
    translate(this.position.x, this.position.y);
    rotate(angle);

    if (debug.checked()) {
      strokeWeight(2);
      noFill();
      // Affiche les 3 premiers poids et perceptions (simplifié pour la lisibilité)
      stroke(0, 255, 0); // Vert pour proie 1
      line(0, 0, 0, -this.dna[0] * 25);
      ellipse(0, 0, this.dna[1] * 2);
      stroke(255, 255, 0); // Jaune pour proie/prédateur 2
      ellipse(0, 0, this.dna[3] * 2);
      stroke(255, 0, 255); // Magenta pour prédateur 3
      ellipse(0, 0, this.dna[5] * 2);
    }

    // Afficher l'image si elle existe, sinon afficher un triangle
    if (this.img) {
      // Variation d'alpha selon la santé
      const alpha = map(constrain(this.health, 0, 2), 0, 2, 100, 255);
      tint(255, alpha);
      imageMode(CENTER);
      image(this.img, 0, 0, this.r * 4, this.r * 4);
      noTint();
    } else {
      // Fallback: afficher un triangle coloré
      const col = this.color;
      const alpha = map(constrain(this.health, 0, 2), 0, 2, 100, 255);
      fill(red(col), green(col), blue(col), alpha);
      stroke(col);
      strokeWeight(1);
      beginShape();
      vertex(0, -this.r * 2);
      vertex(-this.r, this.r * 2);
      vertex(this.r, this.r * 2);
      endShape(CLOSE);
    }

    pop();
  }

  // Exerce une force renvoyant vers le centre du canvas si le véhicule s'approche
  // des bords du canvas
  boundaries() {
    const d = 25;

    let desired = null;

    // si le véhicule est trop à gauche ou trop à droite
    if (this.position.x < d) {
      desired = createVector(this.maxspeed, this.velocity.y);
    } else if (this.position.x > width - d) {
      desired = createVector(-this.maxspeed, this.velocity.y);
    }

    if (this.position.y < d) {
      desired = createVector(this.velocity.x, this.maxspeed);
    } else if (this.position.y > height - d) {
      desired = createVector(this.velocity.x, -this.maxspeed);
    }

    if (desired !== null) {
      desired.normalize();
      desired.mult(this.maxspeed);
      const steer = p5.Vector.sub(desired, this.velocity);
      steer.limit(this.maxforce);
      this.applyForce(steer);
    }
  }
}

//
// ESPÈCES - Subclasses d'Animal
//

//bunny class
// mange la nourriture statique (grass)
// fuit les foxes et les bears
class Bunny extends Animal {
  constructor(x, y, dna) {
    super(x, y, dna);

    //TODO: experiment
    //bunnies start hungry
    this.health = 0.6;
    this.reproductionRate = 0.005; // 0.5% per frame = ~30% per second

    // Configuration spécifique aux lapins (slowest, but agile)
    this.maxspeed = 3.5;
    this.maxforce = 0.5; // High turning ability for evasion
    this.color = color(200, 200, 200); // Gris clair
    this.img = bunnyImg; // Image du lapin

    // Si pas de DNA fourni, initialiser avec des valeurs optimisées pour lapin
    if (dna === undefined) {
      this.dna[0] = random(0.5, 2); // food attraction
      this.dna[1] = random(50, 150); // food perception (increased)
      this.dna[2] = random(-1.5, -0.5); // fox repulsion (negative)
      this.dna[3] = random(80, 200); // fox perception (increased for survival)
      this.dna[4] = random(-1.5, -0.5); // bear repulsion (negative)
      this.dna[5] = random(80, 200); // bear perception (increased for survival)
    }
  }

  behaviors(food, foxes, bears) {
    // 1. Chercher de la nourriture
    const steerFood = this.forage(food, 0.4, this.dna[1]); // Increased nutrition
    steerFood.mult(this.dna[0]);
    this.applyForce(steerFood);

    // 2. Fuir les foxes
    const steerFox = this.seekClosest(foxes, this.dna[3]);
    steerFox.mult(this.dna[2]); // Poids négatif = fuite
    this.applyForce(steerFox);

    // 3. Fuir les bears
    const steerBear = this.seekClosest(bears, this.dna[5]);
    steerBear.mult(this.dna[4]); // Poids négatif = fuite
    this.applyForce(steerBear);
  }
}

//fox class
// mange les bunnies
// fuit les bears
class Fox extends Animal {
  constructor(x, y, dna) {
    super(x, y, dna);

    //experiment
    this.health = 0.7; // Start with moderate health
    this.reproductionRate = 0.002; // 0.2% per frame = ~12% per second

    // Configuration spécifique aux renards (faster than bunnies)
    this.maxspeed = 4;
    this.maxforce = 0.5; // equal turning ability to bunnies
    this.color = color(255, 100, 0); // Orange
    this.img = foxImg; // Image du renard

    // Si pas de DNA fourni, initialiser avec des valeurs optimisées pour renard
    if (dna === undefined) {
      this.dna[0] = random(0.5, 2); // bunnies
      this.dna[1] = random(50, 150);
      this.dna[2] = random(-2, -0.5); // bears
      this.dna[3] = random(50, 150);
      this.dna[4] = 0; // Pas utilisé
      this.dna[5] = 0; // Pas utilisé
    }
  }

  behaviors(bunnies, bears) {
    // 1. Chasser les bunnies
    const steerBunny = this.hunt(bunnies, 0.6, this.dna[1]); // Increased nutrition
    steerBunny.mult(this.dna[0]);
    this.applyForce(steerBunny);

    // 2. Fuir les bears
    const steerBear = this.seekClosest(bears, this.dna[3]);
    steerBear.mult(this.dna[2]); // Poids négatif = fuite
    this.applyForce(steerBear);
  }
}

//bear class
// mange les foxes et les bunnies
// ne fuit personne (pour l'instant)
class Bear extends Animal {
  constructor(x, y, dna) {
    super(x, y, dna);

    //experiment
    this.health = 0.8; // Start with good health
    this.reproductionRate = 0.001; // 0.1% per frame = ~6% per second

    // Configuration spécifique aux ours (fastest but less agile)
    this.maxspeed = 5; // Fastest
    this.maxforce = 0.4; // Lower turning ability due to size
    //this.color = color(139, 69, 19); // Brun
    this.img = bearImg; // Image de l'ours

    // Si pas de DNA fourni, initialiser avec des valeurs optimisées pour ours
    if (dna === undefined) {
      this.dna[0] = random(1, 2.5); // foxes
      this.dna[1] = random(100, 300);
      this.dna[2] = random(1, 3); // bunnies
      this.dna[3] = random(80, 300);
      this.dna[4] = 0; // Pas utilisé
      this.dna[5] = 0; // Pas utilisé
    }
  }

  behaviors(foxes, bunnies) {
    // 1. Chasser les foxes (priorité)
    const steerFox = this.hunt(foxes, 0.8, this.dna[1]); // Increased nutrition
    steerFox.mult(this.dna[0]);
    this.applyForce(steerFox);

    // 2. Chasser les bunnies (secondaire)
    const steerBunny = this.hunt(bunnies, 0.6, this.dna[3]); // Increased nutrition
    steerBunny.mult(this.dna[2]);
    this.applyForce(steerBunny);
  }
}
