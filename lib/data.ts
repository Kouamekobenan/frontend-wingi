import { Category, MenuItem, CateringService } from "@/types";
import Image from 'next/image';
import img4 from '@/images/menu/img4.png';
import img5 from '@/images/menu/img5.png';
import img6 from '@/images/menu/img6.png';
import img7 from '@/images/menu/img7.png';
import img8 from '@/images/menu/img8.png';
import img9 from '@/images/menu/img9.png';
import img10 from '@/images/menu/img10.png';
import img11 from '@/images/menu/img11.png';
import img12 from '@/images/menu/img12.png';
import wingi11 from '@/images/menu/Wingi-11.jpg';
import img2 from '@/images/menu/img2.png';
import img3 from '@/images/menu/img3.png';
import img13 from '@/images/menu/img13.jpg';
import img14 from '@/images/menu/img14.jpg';
import wingi13 from '@/images/menu/Wingi-13.jpg';
import wingi5 from '@/images/menu/Wingi-5.jpg';
import wingi33 from '@/images/menu/Wingi-33.jpg';
import wingi35 from '@/images/menu/Wingi-35.jpg';
import wingi46 from '@/images/menu/Wingi-46.jpg';
import wingi54 from '@/images/menu/Wingi-54.jpg';
import wingi53 from '@/images/menu/Wingi-53.jpg';
import wingi55 from '@/images/menu/Wingi-55.jpg';
import wingi49 from '@/images/menu/Wingi-49.jpg';
import wingi02 from '@/images/menu/Wingi-2.jpg';
import wingi48 from '@/images/menu/Wingi-48.jpg';
import wingi43 from '@/images/menu/Wingi-43.jpg';
import wingi19 from '@/images/menu/Wingi-19.jpg';
export const categories: Category[] = [

  {
    id: "entrées",
    name: "Nos entrées",
    description: "Nos entrées finement sélectionnées",
    image: wingi11
  },

  {
    id: "viandes",
    name: "Nos viandes",
    description: "Découvrez nos viandes de qualité supérieure",
    image: img2
  },

  {
    id: "volailles",
    name: "Nos volailles",
    description: "Découvrez nos volailles de qualité supérieure",
    image: img2
  },

  {
    id: "poissons",
    name: "Nos poissons",
    description: "Découvrez nos poissons de qualité supérieure",
    image: img2
  },

  {
    id: "accompagnements",
    name: "Nos accompagnements",
    description: "Accompagner vos plats avec nos accompagnements faits maison",
    image: img3
  },
  {
    id: "jus",
    name: "Nos jus",
    description: "Accompagnez votre repas avec nos boissons rafraîchissantes",
    image: img13
  }
];

export const menuItems: MenuItem[] = [
  // nos entrées
  {
    id: "Pastels",
    name: "Pastels de thon ou de viande hachée(x7)",
    description: "Beignets croustillants à l'extérieur, moelleux à l'intérieur, garnis de thon ou de viande hachée.",
    price: 5.00,
    image: wingi02,
    category: "entrées",
    popular: true
  },
  {
    id: "Mikaté",
    name: "Mikaté (x10)",
    description: "Beignets sucréés, à la mie aérienne et parfumée d'une touche de vanille.",
    price: 5.00,
    image: wingi13,
    category: "entrées"
  },
  {
    id: "Samoussa",
    name: "Samoussa à la viande(x5)",
    description: "Triangle de feuilles fines garnis de légumes et de viandes épicées, croustillants à souhait.",
    price: 5.00,
    image: wingi5,
    category: "entrées",

  },
  
  //Nos viandes
  {
    id: "choucouya-agneau",
    name: "Choucouya d'agneau",
    description: "Côte d'agneau grillée, sautée avec nos épices maison, oignons rouges et poivrons.",
    price: 14.99,
    image: wingi33,
    category: "viandes",
    popular: true
  },
    {
    id: "Brochette d'agneau",
    name: "Brochette d'agneau",
    description: "Morceaux d'agneau marinés, grillés au charbon de bois et servis avec des oignons confits.",
    price: 14.99,
    image: wingi48,
    category: "viandes"
  },
  

  // Nos volailles
  {
    id: "Choucouya de poulet 1/2",
    name: "1/2 choucouya de poulet",
    description: "1/2 poulet braisé, sauté façon choucouya avec ail, oignons et fines herbes.",
    price: 9.99,
    image: wingi33,
    category: "volailles"
  },
{
    id: "Choucouya de poulet fermier",
    name: "Choucouya de poulet entier",
    description: "Poulet entier braisé, sauté façon choucouya avec ail, oignons et fines herbes.",
    price: 14.99,
    image: wingi33,
    category: "volailles"
  },
{
    id: "Poulet braisé fermier",
    name: "1/2 poulet braisé fermier",
    description: "1/2 poulet mariné 24h dans le mélange d'épices Wingi, grillé lentement au charbon de bois.",
    price: 9.99,
    image: wingi46,
    category: "volailles",
    popular: true
  },
  {
    id: "Poulet braisé entier fermier",
    name: "Poulet braisé entier fermier",
    description: "Poulet mariné 24h dans le mélange d'épices Wingi, grillé lentement au charbon de bois.",
    price: 14.99,
    image: wingi43,
    category: "volailles"
  },

  // nos poissons

  {
    id: "Bar braisé",
    name: "Bar braisé",
    description: "Poisson entier farci aux herbes, braisé à la flamme.",
    price: 10.99,
    image: img7,
    category: "poissons"
  },
  {
    id: "Daurade braisé",
    name: "Daurade braisé",
    description: "Poisson entier farci aux herbes, braisé à la flamme.",
    price: 14.99,
    image: wingi19,
    category: "poissons"
  },
  

  // nos accompagnements
  {
    id: "Attiéké",
    name: "Attiéké",
    description: "Semoule de manioc parfumée.",
    price: 5.00,
    image:wingi54,
    category: "accompagnements",
    popular: true
  },
  {
    id: "Alloco",
    name: "Alloco",
    description: "Banane plantain dorée.",
    price: 5.00,
    image: wingi53,
    category: "accompagnements"
  },
  {
    id: "Ablo",
    name: "Ablo (x6)",
    description: "Gâteau de maïs cuit à la vapeur, servis avec sa sauce tomatée.",
    price: 5.00,
    image: wingi55,
    category: "accompagnements",
    popular: true
  },
  {
    id: "Frites d'igname",
    name: "Frites d'igname",
    description: "Igname dorée.",
    price: 5.00,
    image: wingi49,
    category: "accompagnements",
    popular: true
  },
  
  // Nos boissons 
  {
    id: "Bissap",  
    name: "Bissap 0,5 l",
    description: "infusion florale d'hibiscus séchés, relevée d'une pointe de citron vert et d'une note de menthe fraîche",
    price: 3.00,
    image: img13,
    category: "jus"
  },
  {
    id: "Ganmankoudji",
    name: "Ganmankoudji 0,5 l",
    description: "Macération de gingembre frais adoucie par un sirop maison au citron",
    price: 3.00,
    image: img14,
    category: "jus"
  },
  {
    id: "Bissaps",
    name: "Bissap 1 l",
    description: "infusion florale d'hibiscus séchés, relevée d'une pointe de citron vert et d'une note de menthe fraîche",
    price: 5.00,
    image: img13,
    category: "jus"
  },
  {
    id: "Ganmankoudjis ",
    name: "Ganmankoudji 1 l",
    description: "Macération de gingembre frais adoucie par un sirop maison au citron",
    price: 5.00,
    image: img14,
    category: "jus"
  }
];

export const cateringServices: CateringService[] = [
  {
    id: "cocktail",
    name: "Réception cocktail",
    description: "Service de cocktails et canapés pour vos événements professionnels ou privés",
    minGuests: 20,
    maxGuests: 200,
    pricePerPerson: 45,
    image: "https://images.pexels.com/photos/587741/pexels-photo-587741.jpeg"
  },
  {
    id: "buffet",
    name: "Buffet gourmand",
    description: "Un large choix de plats chauds et froids présentés sous forme de buffet",
    minGuests: 30,
    maxGuests: 150,
    pricePerPerson: 55,
    image: "https://images.pexels.com/photos/5638732/pexels-photo-5638732.jpeg"
  },
  {
    id: "gastronomique",
    name: "Dîner gastronomique",
    description: "Un repas gastronomique servi à table pour vos événements d'exception",
    minGuests: 10,
    maxGuests: 80,
    pricePerPerson: 75,
    image: "https://images.pexels.com/photos/696218/pexels-photo-696218.jpeg"
  },
  {
    id: "mariage",
    name: "Réception de mariage",
    description: "Une offre complète pour votre mariage, de l'apéritif au dessert fabuleux",
    minGuests: 50,
    maxGuests: 250,
    pricePerPerson: 95,
    image: "https://images.pexels.com/photos/1456613/pexels-photo-1456613.jpeg"
  }
];

export const testimonials = [
  {
    id: "1",
    name: "Sem Yeboua",
    text: "Un service impeccable et des plats délicieux. La livraison était ponctuelle et tout était parfaitement présenté.",
    rating: 5
  },
  {
    id: "2",
    name: "Regis Kouamé",
    text: "Nous avons fait appel à leurs services pour notre mariage et ce fut un succès total. Nos invités ont adoré le menu !",
    rating: 5
  },
  {
    id: "3",
    name: "Parfait Guigui ",
    text: "La qualité des plats est exceptionnelle, chaque bouchée est un délice. Je recommande vivement leur service traiteur.",
    rating: 4
  }
];