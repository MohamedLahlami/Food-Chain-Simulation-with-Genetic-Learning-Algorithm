// Daniel Shiffman
// The Coding Train
// Coding Challenge 69: Steering Evolution

// Part 1: https://youtu.be/flxOkx0yLrY
// Part 2: https://youtu.be/XaOVH8ZSRNA
// Part 3: https://youtu.be/vZUWTlK7D2Q
// Part 4: https://youtu.be/ykOcaInciBI
// Part 5: https://youtu.be/VnFF5V5DS8s

// Modifié pour créer un écosystème avec plusieurs espèces

// Arrays pour chaque espèce
const bunnies = [];
const foxes = [];
const bears = [];
const food = [];

let debug;

// Images pour chaque espèce
let bunnyImg;
let foxImg;
let bearImg;

function preload() {
  bunnyImg = loadImage("assets/bunny.png");
  foxImg = loadImage("assets/fox.png");
  bearImg = loadImage("assets/bear.png");
}

function setup() {
  createCanvas(1000, 1000);

  // Initialisation de la nourriture (grass)
  for (let i = 0; i < 100; i++) {
    const x = random(width);
    const y = random(height);
    food.push(createVector(x, y));
  }

  // Initialisation des bunnies (lapins)
  for (let i = 0; i < 50; i++) {
    const x = random(width);
    const y = random(height);
    bunnies.push(new Bunny(x, y));
  }

  // Initialisation des foxes (renards)
  for (let i = 0; i < 10; i++) {
    const x = random(width);
    const y = random(height);
    foxes.push(new Fox(x, y));
  }

  // Initialisation des bears (ours)
  for (let i = 0; i < 2; i++) {
    const x = random(width);
    const y = random(height);
    bears.push(new Bear(x, y));
  }

  debug = createCheckbox();
}

function mouseDragged() {
  // Clic pour ajouter un bunny
  bunnies.push(new Bunny(mouseX, mouseY));
}

// appelée 60 fois par seconde
function draw() {
  background(0);

  // Apparition aléatoire de nourriture (15% de chances)
  if (random(1) < 0.15) {
    const x = random(width);
    const y = random(height);
    food.push(createVector(x, y));
  }

  // Dessiner la nourriture (verte)
  for (let i = 0; i < food.length; i++) {
    fill(0, 255, 0);
    noStroke();
    ellipse(food[i].x, food[i].y, 4, 4);
  }

  // ============================================
  // BOUCLE BUNNIES (Lapins)
  // ============================================
  for (let i = bunnies.length - 1; i >= 0; i--) {
    bunnies[i].boundaries();
    bunnies[i].behaviors(food, foxes, bears);
    bunnies[i].update();
    bunnies[i].display();

    // Reproduction
    const newBunny = bunnies[i].clone();
    if (newBunny != null) {
      bunnies.push(newBunny);
    }

    // Mort
    if (bunnies[i].dead()) {
      // Les bunnies morts deviennent de la nourriture
      food.push(createVector(bunnies[i].position.x, bunnies[i].position.y));
      bunnies.splice(i, 1);
    }
  }

  // ============================================
  // BOUCLE FOXES (Renards)
  // ============================================
  for (let i = foxes.length - 1; i >= 0; i--) {
    foxes[i].boundaries();
    foxes[i].behaviors(bunnies, bears);
    foxes[i].update();
    foxes[i].display();

    // Reproduction
    const newFox = foxes[i].clone();
    if (newFox != null) {
      foxes.push(newFox);
    }

    // Mort
    if (foxes[i].dead()) {
      // Les foxes ne deviennent pas de la nourriture (carnivores)
      foxes.splice(i, 1);
    }
  }

  // ============================================
  // BOUCLE BEARS (Ours)
  // ============================================
  for (let i = bears.length - 1; i >= 0; i--) {
    bears[i].boundaries();
    bears[i].behaviors(foxes, bunnies);
    bears[i].update();
    bears[i].display();

    // Reproduction
    const newBear = bears[i].clone();
    if (newBear != null) {
      bears.push(newBear);
    }

    // Mort
    if (bears[i].dead()) {
      // Les bears ne deviennent pas de la nourriture
      bears.splice(i, 1);
    }
  }

  // ============================================
  // AFFICHAGE DES STATISTIQUES
  // ============================================
  fill(255);
  textSize(16);

  // Population de chaque espèce
  text("Bunnies: " + bunnies.length, 10, 30);
  text("Foxes: " + foxes.length, 10, 50);
  text("Bears: " + bears.length, 10, 70);
  text("Food: " + food.length, 10, 90);

  // if (true) {
  if (debug.checked()) {
    displayBestDNA("Bunny", bunnies, 110);
    displayBestDNA("Fox", foxes, 130);
    displayBestDNA("Bear", bears, 150);
  }
}

// Fonction helper pour afficher le DNA du meilleur individu d'une espèce
function displayBestDNA(speciesName, population, yPos) {
  if (population.length > 0) {
    let maxHealth = 0;
    let bestAnimal;

    for (let animal of population) {
      if (animal.health > maxHealth) {
        maxHealth = animal.health;
        bestAnimal = animal;
      }
    }

    if (bestAnimal) {
      fill(255);
      textSize(12);
      text(
        speciesName +
          "\nMAX HEALTH: " +
          maxHealth.toFixed(2) +
          " DNA: " +
          bestAnimal.dna.map((n) => n.toFixed(2)).join(", "),
        10,
        yPos
      );
    }
  }
}
