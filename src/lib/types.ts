export type CategoryId = 'soups' | 'rice' | 'grills' | 'continental' | 'smallchops' | 'drinks';

export interface Category { id: CategoryId; name: string; blurb: string; }

export interface OptionChoice { id: string; label: string; price: number; } // price in naira, 0 = free
export interface OptionGroup {
  id: string; label: string;
  type: 'single' | 'multi';
  required?: boolean;
  choices: OptionChoice[];
}

export interface Dish {
  id: string; slug: string; name: string; description: string;
  category: CategoryId;
  type: 'local' | 'continental';
  price: number;              // naira
  image?: string;             // /menu/<file>.jpg — drop photos in /public/menu
  popular?: boolean;
  options?: OptionGroup[];
}

export type FulfilmentType = 'pickup' | 'delivery';
export type OrderStatus = 'received' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'picked_up' | 'cancelled';
