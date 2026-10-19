import type { Category, Dish, OptionGroup } from './types';

export const categories: Category[] = [
  { id: 'soups', name: 'Soups & Swallow', blurb: 'Egusi, Banga, Ogbono, Afang and more' },
  { id: 'rice', name: 'Rice & Beans', blurb: 'Jollof, fried rice, ofada, ewa agoyin' },
  { id: 'grills', name: 'Grills & Proteins', blurb: 'Peppered chicken, turkey, fish, suya' },
  { id: 'continental', name: 'Continental', blurb: 'Pasta, club sandwich, grilled chicken plates' },
  { id: 'smallchops', name: 'Small Chops', blurb: 'Puff-puff, spring rolls, samosa, gizdodo' },
  { id: 'drinks', name: 'Drinks', blurb: 'Zobo, chapman, smoothies, water' },
];

const protein: OptionGroup = {
  id: 'protein', label: 'Choose protein', type: 'single', required: true,
  choices: [
    { id: 'beef', label: 'Beef', price: 0 },
    { id: 'chicken', label: 'Chicken', price: 800 },
    { id: 'turkey', label: 'Turkey', price: 1500 },
    { id: 'fish', label: 'Fish', price: 1000 },
  ],
};
const swallow: OptionGroup = {
  id: 'swallow', label: 'Choose swallow', type: 'single', required: true,
  choices: [
    { id: 'pounded', label: 'Pounded yam', price: 0 },
    { id: 'eba', label: 'Eba', price: 0 },
    { id: 'semo', label: 'Semo', price: 0 },
    { id: 'amala', label: 'Amala', price: 0 },
  ],
};
const sides: OptionGroup = {
  id: 'sides', label: 'Add extras', type: 'multi',
  choices: [
    { id: 'plantain', label: 'Fried plantain', price: 700 },
    { id: 'moimoi', label: 'Moi-moi', price: 800 },
    { id: 'coleslaw', label: 'Coleslaw', price: 500 },
  ],
};

// NOTE: prices are placeholders — replace with Zee's real prices (batch 5 adds an admin editor).
export const dishes: Dish[] = [
  { id: 'd01', slug: 'egusi-soup', name: 'Egusi Soup', description: 'Melon seed soup with ugu leaf, stockfish and assorted meat.', category: 'soups', type: 'local', price: 3500, popular: true, options: [swallow, protein] },
  { id: 'd02', slug: 'banga-soup', name: 'Banga Soup', description: 'Palm fruit soup, the Delta way, with catfish and spices.', category: 'soups', type: 'local', price: 4000, popular: true, options: [swallow, protein] },
  { id: 'd03', slug: 'ogbono-soup', name: 'Ogbono Soup', description: 'Draw soup with ogbono, crayfish and smoked fish.', category: 'soups', type: 'local', price: 3500, options: [swallow, protein] },
  { id: 'd04', slug: 'afang-soup', name: 'Afang Soup', description: 'Afang and waterleaf soup with periwinkle and assorted meat.', category: 'soups', type: 'local', price: 4200, options: [swallow, protein] },
  { id: 'd05', slug: 'party-jollof', name: 'Party Jollof Rice', description: 'Smoky firewood-style jollof, served with your choice of protein.', category: 'rice', type: 'local', price: 2500, popular: true, options: [protein, sides] },
  { id: 'd06', slug: 'fried-rice', name: 'Fried Rice', description: 'Vegetable fried rice with liver and sweet peppers.', category: 'rice', type: 'local', price: 2800, options: [protein, sides] },
  { id: 'd07', slug: 'ofada-rice', name: 'Ofada Rice & Ayamase', description: 'Ofada rice with green pepper sauce, egg and assorted meat.', category: 'rice', type: 'local', price: 3800, options: [sides] },
  { id: 'd08', slug: 'ewa-agoyin', name: 'Ewa Agoyin', description: 'Soft beans with spicy dark pepper sauce and bread.', category: 'rice', type: 'local', price: 2000, options: [sides] },
  { id: 'd09', slug: 'peppered-chicken', name: 'Peppered Chicken', description: 'Grilled chicken tossed in hot pepper sauce.', category: 'grills', type: 'local', price: 3000, popular: true },
  { id: 'd10', slug: 'asun', name: 'Asun (Peppered Goat)', description: 'Smoky roasted goat meat in fiery pepper.', category: 'grills', type: 'local', price: 3500 },
  { id: 'd11', slug: 'grilled-fish', name: 'Grilled Fish', description: 'Whole croaker grilled with house spice rub.', category: 'grills', type: 'local', price: 5000 },
  { id: 'd12', slug: 'spaghetti-bolognese', name: 'Spaghetti Bolognese', description: 'Slow-cooked beef sauce over al dente spaghetti.', category: 'continental', type: 'continental', price: 3500 },
  { id: 'd13', slug: 'club-sandwich', name: 'Club Sandwich', description: 'Triple-decker with chicken, egg, lettuce and fries.', category: 'continental', type: 'continental', price: 4000 },
  { id: 'd14', slug: 'grilled-chicken-plate', name: 'Grilled Chicken Plate', description: 'Herb-grilled chicken, buttered veg and mashed potato.', category: 'continental', type: 'continental', price: 4500, popular: true },
  { id: 'd15', slug: 'small-chops-platter', name: 'Small Chops Platter', description: 'Puff-puff, spring rolls, samosa and peppered gizzard.', category: 'smallchops', type: 'local', price: 4500 },
  { id: 'd16', slug: 'zobo', name: 'Chilled Zobo', description: 'Hibiscus drink with ginger and pineapple, served cold.', category: 'drinks', type: 'local', price: 1000 },
];

export const getDish = (slug: string) => dishes.find((d) => d.slug === slug);
