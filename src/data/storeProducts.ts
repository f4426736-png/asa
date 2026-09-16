import redVelvetImg from '../assets/images/red_velvet_cookie_1789517277288.jpg';
import peanutButterImg from '../assets/images/peanut_butter_cookie_1789517293237.jpg';
import strawberryImg from '../assets/images/strawberry_cookie_1789517307657.jpg';
import lemonCrinkleImg from '../assets/images/lemon_crinkle_cookie_1789517327460.jpg';
import caramelFilledImg from '../assets/images/caramel_filled_cookie_1789517343702.jpg';

export interface CookieProduct {
  id: string;
  name: string;
  price: number;
  rating: number;
  reviewsCount: number;
  category: 'Clásicas' | 'Rellenas' | 'Sin azúcar' | 'Integrales' | 'Especiales';
  flavor: string;
  brand: string;
  badge?: 'Más vendido' | 'Nuevo';
  image: string;
  fallbackImage?: string;
  description: string;
  popularScore: number;
}

export interface CartItem {
  product: CookieProduct;
  quantity: number;
}

export const COOKIE_PRODUCTS: CookieProduct[] = [
  {
    id: 'cookie-1',
    name: 'Galletas con Chispas de Chocolate',
    price: 6.50,
    rating: 4.5,
    reviewsCount: 148,
    category: 'Clásicas',
    flavor: 'Chocolate',
    brand: 'Cookie Planet',
    badge: 'Más vendido',
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&auto=format&fit=crop&q=80',
    fallbackImage: '/chocolate-chip.jpg',
    description: 'Nuestra icónica receta con abundante chocolate belga al 60% derretido en el centro.',
    popularScore: 99
  },
  {
    id: 'cookie-2',
    name: 'Galletas Doble Chocolate',
    price: 7.50,
    rating: 4.7,
    reviewsCount: 112,
    category: 'Especiales',
    flavor: 'Chocolate',
    brand: 'Cookie Dream',
    badge: 'Nuevo',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&auto=format&fit=crop&q=80',
    fallbackImage: '/cookies-and-cream.png',
    description: 'Masa de cacao oscuro de origen holandés con chispas semiamargas y toque de sal marina.',
    popularScore: 95
  },
  {
    id: 'cookie-3',
    name: 'Galletas Rellenas de Oreo',
    price: 6.90,
    rating: 4.6,
    reviewsCount: 94,
    category: 'Rellenas',
    flavor: 'Oreo',
    brand: 'Oreo',
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&auto=format&fit=crop&q=80',
    fallbackImage: '/cookies-and-cream.png',
    description: 'Trozo entero de Oreo horneado dentro de una suave masa de vainilla artesanal.',
    popularScore: 92
  },
  {
    id: 'cookie-4',
    name: 'Galletas de Fresa',
    price: 6.50,
    rating: 4.4,
    reviewsCount: 68,
    category: 'Especiales',
    flavor: 'Fresa',
    brand: 'Sweet Bites',
    image: strawberryImg,
    fallbackImage: '/red-velvet.png',
    description: 'Fresas naturales liofilizadas, notas florales de frambuesa y chocolate blanco cremoso.',
    popularScore: 84
  },
  {
    id: 'cookie-5',
    name: 'Galletas de Avena',
    price: 5.90,
    rating: 4.3,
    reviewsCount: 79,
    category: 'Integrales',
    flavor: 'Vainilla',
    brand: "Nature's Cookies",
    image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=800&auto=format&fit=crop&q=80',
    fallbackImage: '/oatmeal-raisin.png',
    description: 'Avena integral tostada con canela de Ceilán, pasas rubias y miel de abeja pura.',
    popularScore: 80
  },
  {
    id: 'cookie-6',
    name: 'Galletas de Mantequilla de Maní',
    price: 6.50,
    rating: 4.6,
    reviewsCount: 88,
    category: 'Clásicas',
    flavor: 'Mantequilla de maní',
    brand: 'Cookie Planet',
    image: peanutButterImg,
    fallbackImage: '/butter-cookies.png',
    description: 'Crema de maní 100% natural, textura arenosa y suave con el patrón tradicional de tenedor.',
    popularScore: 87
  },
  {
    id: 'cookie-7',
    name: 'Galletas de Limón',
    price: 6.50,
    rating: 4.4,
    reviewsCount: 53,
    category: 'Sin azúcar',
    flavor: 'Limón',
    brand: 'Sweet Bites',
    image: lemonCrinkleImg,
    fallbackImage: '/swirl-cookies.png',
    description: 'Glaseado cítrico refrescante, ralladura de limón persa y masa liviana tipo crinkle.',
    popularScore: 78
  },
  {
    id: 'cookie-8',
    name: 'Galletas Red Velvet',
    price: 7.50,
    rating: 4.6,
    reviewsCount: 104,
    category: 'Especiales',
    flavor: 'Red Velvet',
    brand: 'Cookie Dream',
    image: redVelvetImg,
    fallbackImage: '/red-velvet.png',
    description: 'Inspiradas en la clásica tarta americana, con suave queso crema en su corazón.',
    popularScore: 91
  },
  {
    id: 'cookie-9',
    name: 'Galletas de Chispas de Chocolate y Nueces',
    price: 7.50,
    rating: 4.5,
    reviewsCount: 97,
    category: 'Clásicas',
    flavor: 'Chocolate',
    brand: 'Chips Ahoy',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80',
    fallbackImage: '/chocolate-chip.jpg',
    description: 'Crocantes nueces pecán tostadas combinadas con chips semiamargos y masa de mantequilla dorada.',
    popularScore: 89
  },
  {
    id: 'cookie-10',
    name: 'Galletas de Coco',
    price: 6.00,
    rating: 4.2,
    reviewsCount: 46,
    category: 'Sin azúcar',
    flavor: 'Coco',
    brand: "Nature's Cookies",
    image: 'https://images.unsplash.com/photo-1516919549054-e08258825f80?w=800&auto=format&fit=crop&q=80',
    fallbackImage: '/butter-cookies.png',
    description: 'Coco rallado tostado al punto justo, toque caribeño y endulzado naturalmente.',
    popularScore: 75
  },
  {
    id: 'cookie-11',
    name: 'Galletas Rellenas de Caramelo',
    price: 7.50,
    rating: 4.7,
    reviewsCount: 135,
    category: 'Rellenas',
    flavor: 'Caramelo',
    brand: 'Cookie Planet',
    image: caramelFilledImg,
    fallbackImage: '/chocolate-chip.jpg',
    description: 'Flujo irresistible de toffee y caramelo salado fundido en cada bocado.',
    popularScore: 96
  },
  {
    id: 'cookie-12',
    name: 'Galletas de Café',
    price: 6.50,
    rating: 4.3,
    reviewsCount: 62,
    category: 'Especiales',
    flavor: 'Café',
    brand: 'Cookie Dream',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80',
    fallbackImage: '/cookies-and-cream.png',
    description: 'Extracto de café arábica de altura y chispas de chocolate amargo para amantes del espresso.',
    popularScore: 82
  }
];

export const CATEGORIES_LIST = [
  'Todas las galletas',
  'Clásicas',
  'Rellenas',
  'Sin azúcar',
  'Integrales',
  'Especiales'
] as const;

export const FLAVORS_LIST = [
  'Chocolate',
  'Vainilla',
  'Fresa',
  'Limón',
  'Oreo',
  'Mantequilla de maní',
  'Coco',
  'Caramelo',
  'Café',
  'Red Velvet'
] as const;

export const BRANDS_LIST = [
  'Todas las marcas',
  'Cookie Planet',
  'Cookie Dream',
  'Sweet Bites',
  "Nature's Cookies",
  'Oreo',
  'Chips Ahoy'
] as const;

export const storeProducts = COOKIE_PRODUCTS;
