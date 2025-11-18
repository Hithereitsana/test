import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface Product {
  name: string;
  description: string;
  category: string;
  brand: string;
  price: number;
  inStock: boolean;
  tags: string[];
}

const categories = [
  'Électronique', 'Vêtements', 'Maison & Jardin', 'Sport & Loisirs',
  'Livres', 'Jouets', 'Beauté & Santé', 'Automobile', 'Alimentation',
  'Bricolage', 'Informatique', 'Musique', 'Photo & Vidéo', 'Jardinage'
];

const brands = [
  'TechCorp', 'FashionBrand', 'HomeStyle', 'SportPro', 'BookWorld',
  'ToyLand', 'BeautyPlus', 'AutoMax', 'FoodFresh', 'BuildIt',
  'CompTech', 'MusicHub', 'PhotoPro', 'GardenLife', 'EcoBrand',
  'PremiumLine', 'BasicGoods', 'SmartHome', 'FitLife', 'StyleCo'
];

const tagOptions = [
  'nouveau', 'populaire', 'bestseller', 'promo', 'exclusif',
  'premium', 'deluxe', 'standard', 'basique', 'éco-friendly',
  'durable', 'innovant', 'classique', 'moderne', 'vintage'
];

const productTemplates = {
  'Électronique': [
    { name: 'Smartphone', priceRange: [200, 1200], desc: 'Smartphone avec écran haute résolution' },
    { name: 'Ordinateur Portable', priceRange: [500, 2500], desc: 'Laptop performant' },
    { name: 'Tablette', priceRange: [150, 800], desc: 'Tablette tactile' },
    { name: 'Écouteurs', priceRange: [20, 400], desc: 'Écouteurs audio' },
    { name: 'Enceinte', priceRange: [30, 500], desc: 'Enceinte Bluetooth' },
    { name: 'Montre Connectée', priceRange: [100, 600], desc: 'Montre intelligente' },
    { name: 'Clavier', priceRange: [30, 200], desc: 'Clavier mécanique' },
    { name: 'Souris', priceRange: [15, 150], desc: 'Souris gaming' },
    { name: 'Webcam', priceRange: [40, 200], desc: 'Webcam HD' },
    { name: 'Disque Dur', priceRange: [50, 300], desc: 'Disque dur externe' }
  ],
  'Vêtements': [
    { name: 'T-shirt', priceRange: [15, 50], desc: 'T-shirt en coton' },
    { name: 'Jean', priceRange: [40, 150], desc: 'Jean coupe moderne' },
    { name: 'Veste', priceRange: [60, 400], desc: 'Veste stylée' },
    { name: 'Chaussures', priceRange: [50, 300], desc: 'Chaussures confortables' },
    { name: 'Robe', priceRange: [30, 200], desc: 'Robe élégante' },
    { name: 'Pull', priceRange: [40, 150], desc: 'Pull chaud' },
    { name: 'Manteau', priceRange: [80, 400], desc: 'Manteau d\'hiver' },
    { name: 'Sac', priceRange: [25, 300], desc: 'Sac à main' },
    { name: 'Casquette', priceRange: [15, 50], desc: 'Casquette ajustable' },
    { name: 'Gants', priceRange: [10, 60], desc: 'Gants chauds' }
  ],
  'Maison & Jardin': [
    { name: 'Table', priceRange: [100, 800], desc: 'Table design' },
    { name: 'Chaise', priceRange: [50, 400], desc: 'Chaise confortable' },
    { name: 'Canapé', priceRange: [300, 2000], desc: 'Canapé spacieux' },
    { name: 'Lampe', priceRange: [30, 300], desc: 'Lampe LED' },
    { name: 'Plante', priceRange: [10, 100], desc: 'Plante décorative' },
    { name: 'Machine à Café', priceRange: [80, 600], desc: 'Machine expresso' },
    { name: 'Aspirateur', priceRange: [100, 500], desc: 'Aspirateur puissant' },
    { name: 'Literie', priceRange: [50, 400], desc: 'Ensemble de literie' },
    { name: 'Rideaux', priceRange: [30, 200], desc: 'Rideaux occultants' },
    { name: 'Tapis', priceRange: [40, 300], desc: 'Tapis moelleux' }
  ],
  'Sport & Loisirs': [
    { name: 'Raquette', priceRange: [50, 300], desc: 'Raquette de sport' },
    { name: 'Vélo', priceRange: [200, 3000], desc: 'Vélo de route' },
    { name: 'Tapis de Yoga', priceRange: [20, 100], desc: 'Tapis antidérapant' },
    { name: 'Haltères', priceRange: [30, 200], desc: 'Haltères ajustables' },
    { name: 'Tente', priceRange: [80, 500], desc: 'Tente de camping' },
    { name: 'Sac de Sport', priceRange: [25, 150], desc: 'Sac de sport' },
    { name: 'Bouteille', priceRange: [10, 50], desc: 'Bouteille isotherme' },
    { name: 'Montre Sport', priceRange: [50, 400], desc: 'Montre GPS' },
    { name: 'Chaussures Running', priceRange: [60, 200], desc: 'Chaussures de course' },
    { name: 'Ballon', priceRange: [15, 80], desc: 'Ballon de sport' }
  ],
  'Livres': [
    { name: 'Roman', priceRange: [8, 25], desc: 'Roman à succès' },
    { name: 'Guide', priceRange: [12, 30], desc: 'Guide de voyage' },
    { name: 'Livre Enfant', priceRange: [6, 20], desc: 'Livre illustré' },
    { name: 'BD', priceRange: [10, 25], desc: 'Bande dessinée' },
    { name: 'Dictionnaire', priceRange: [20, 60], desc: 'Dictionnaire complet' },
    { name: 'Cuisine', priceRange: [15, 40], desc: 'Livre de recettes' },
    { name: 'Histoire', priceRange: [12, 35], desc: 'Livre historique' },
    { name: 'Science', priceRange: [18, 50], desc: 'Livre scientifique' },
    { name: 'Biographie', priceRange: [14, 30], desc: 'Biographie' },
    { name: 'Polar', priceRange: [10, 22], desc: 'Roman policier' }
  ],
  'Jouets': [
    { name: 'Puzzle', priceRange: [10, 50], desc: 'Puzzle éducatif' },
    { name: 'Lego', priceRange: [20, 200], desc: 'Set de construction' },
    { name: 'Poupée', priceRange: [15, 100], desc: 'Poupée interactive' },
    { name: 'Voiture Télécommandée', priceRange: [30, 150], desc: 'Voiture RC' },
    { name: 'Jeu de Société', priceRange: [20, 80], desc: 'Jeu familial' },
    { name: 'Peluche', priceRange: [15, 60], desc: 'Peluche douce' },
    { name: 'Figurine', priceRange: [10, 50], desc: 'Figurine collection' },
    { name: 'Jeu de Construction', priceRange: [25, 120], desc: 'Blocs de construction' },
    { name: 'Déguisement', priceRange: [20, 80], desc: 'Costume enfant' },
    { name: 'Instrument', priceRange: [30, 200], desc: 'Instrument de musique' }
  ],
  'Beauté & Santé': [
    { name: 'Crème', priceRange: [15, 80], desc: 'Crème hydratante' },
    { name: 'Parfum', priceRange: [30, 150], desc: 'Parfum élégant' },
    { name: 'Kit Maquillage', priceRange: [25, 120], desc: 'Kit complet' },
    { name: 'Shampoing', priceRange: [8, 40], desc: 'Shampoing bio' },
    { name: 'Masque', priceRange: [12, 50], desc: 'Masque visage' },
    { name: 'Rouge à Lèvres', priceRange: [10, 35], desc: 'Rouge à lèvres' },
    { name: 'Mascara', priceRange: [12, 40], desc: 'Mascara volumisant' },
    { name: 'Sérum', priceRange: [20, 100], desc: 'Sérum anti-âge' },
    { name: 'Dentifrice', priceRange: [5, 20], desc: 'Dentifrice blanchissant' },
    { name: 'Déodorant', priceRange: [6, 25], desc: 'Déodorant naturel' }
  ],
  'Automobile': [
    { name: 'Pneus', priceRange: [60, 200], desc: 'Pneus haute performance' },
    { name: 'Batterie', priceRange: [80, 250], desc: 'Batterie voiture' },
    { name: 'GPS', priceRange: [100, 300], desc: 'GPS automobile' },
    { name: 'Siège Auto', priceRange: [150, 400], desc: 'Siège enfant' },
    { name: 'Kit Éclairage', priceRange: [30, 150], desc: 'Phares LED' },
    { name: 'Huile Moteur', priceRange: [20, 80], desc: 'Huile synthétique' },
    { name: 'Filtre', priceRange: [10, 50], desc: 'Filtre à air' },
    { name: 'Plaquettes', priceRange: [40, 150], desc: 'Plaquettes de frein' },
    { name: 'Amortisseurs', priceRange: [100, 400], desc: 'Amortisseurs' },
    { name: 'Rétroviseur', priceRange: [25, 100], desc: 'Rétroviseur' }
  ]
};

function randomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

function randomTags(): string[] {
  const count = randomInt(1, 3);
  const selected = new Set<string>();
  while (selected.size < count) {
    selected.add(randomElement(tagOptions));
  }
  return Array.from(selected);
}

function generateProduct(): Product {
  const category = randomElement(categories);
  const templates = productTemplates[category as keyof typeof productTemplates] || productTemplates['Électronique'];
  const template = randomElement(templates);
  const brand = randomElement(brands);
  const [minPrice, maxPrice] = template.priceRange;
  const price = randomFloat(minPrice, maxPrice);
  const variant = randomInt(1, 5);
  
  return {
    name: `${template.name} ${brand} ${variant > 1 ? `v${variant}` : ''}`.trim(),
    description: `${template.desc}, marque ${brand}, qualité premium`,
    category,
    brand,
    price,
    inStock: Math.random() > 0.15, // 85% en stock
    tags: randomTags()
  };
}

function generateProducts(count: number): Product[] {
  const products: Product[] = [];
  for (let i = 0; i < count; i++) {
    products.push(generateProduct());
  }
  return products;
}

// Générer 10000 produits par défaut
const count = process.argv[2] ? parseInt(process.argv[2], 10) : (process.env.PRODUCTS_COUNT ? parseInt(process.env.PRODUCTS_COUNT, 10) : 10000);
console.log(`Génération de ${count} produits...`);

const products = generateProducts(count);
const outputPath = join(__dirname, 'products.json');
writeFileSync(outputPath, JSON.stringify(products, null, 2), 'utf-8');

console.log(`✅ ${count} produits générés dans ${outputPath}`);
console.log(`📊 Statistiques:`);
console.log(`   - Catégories: ${new Set(products.map(p => p.category)).size}`);
console.log(`   - Marques: ${new Set(products.map(p => p.brand)).size}`);
console.log(`   - En stock: ${products.filter(p => p.inStock).length} (${Math.round(products.filter(p => p.inStock).length / count * 100)}%)`);

