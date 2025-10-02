import { useState } from "react";
import Image, { StaticImageData } from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, X, Check, ZoomIn } from "lucide-react";
import { useCart } from "@/lib/cart";
import { Category, MenuItem as MenuItemType, Side as SideType } from "@/types";

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

// Types
interface Side {
  id: string;
  name: string;
  additionalPrice: number;
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string | StaticImageData;
  category: string;
  popular?: boolean;
  vegetarian?: boolean;
  spicy?: boolean;
}

interface MenuItemProps {
  item: MenuItemType;
  showAddButton?: boolean;
}

// Données des accompagnements
const availableSides: Side[] = [
  { id: "Attiéké", name: "Attiéké", additionalPrice: 5 },
  { id: "Alloco", name: "Alloco", additionalPrice: 5 },
  { id: "Ablo", name: "Ablo (x6)", additionalPrice: 5 },
  { id: "Frites d'igname", name: "Frites d'igname", additionalPrice: 5 },
];

// Formatage du prix
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(price);
};

// Composant MenuItem
interface MenuItemProps {
  item: MenuItem;
  showAddButton?: boolean;
}

function MenuItemComponent({ item, showAddButton = false }: MenuItemProps) {
  const { addItem } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSide, setSelectedSide] = useState<Side | null>(null);
  const [isImageZoomed, setIsImageZoomed] = useState(false);

  const handleAddToCart = () => {
    const isMainDish = ["viandes", "volailles", "poissons"].includes(item.category);
    
    if (isMainDish) {
      setIsModalOpen(true);
    } else {
      addItem(item, 1);
    }
  };

  const handleSideSelection = (side: Side) => {
    setSelectedSide(side);
  };

  const confirmSelection = () => {
    // Calculer le prix total avec l'accompagnement
    const totalPrice = item.price + (selectedSide?.additionalPrice || 0);
    
    // Créer un nouvel objet avec le prix total et le nom modifié pour inclure l'accompagnement
    const itemWithSide = {
      ...item,
      price: totalPrice,
      name: selectedSide 
        ? `${item.name} avec ${selectedSide.name}`
        : item.name,
      originalName: item.name, // Garder le nom original pour référence
      selectedSide: selectedSide || undefined
    };

    // Ajouter l'article avec le nom modifié au panier
    addItem(itemWithSide, 1);
    
    // Fermer le modal et réinitialiser la sélection
    setIsModalOpen(false);
    setSelectedSide(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSide(null);
  };

  const openImageZoom = () => {
    setIsImageZoomed(true);
  };

  const closeImageZoom = () => {
    setIsImageZoomed(false);
  };

  return (
    <>
      <Card className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="grid sm:grid-cols-[120px_1fr] gap-4">
          <div className="relative h-52 sm:h-full overflow-hidden group">
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover transition-transform duration-300 ease-in-out hover:scale-105 cursor-zoom-in"
              sizes="(max-width: 640px) 100vw, 120px"
              onClick={openImageZoom}
            />
            {/* Overlay avec icône zoom */}
            <div 
              className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center cursor-zoom-in"
              onClick={openImageZoom}
            >
              <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>
          
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium font-serif">{item.name}</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-2 line-clamp-2">{item.description}</p>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  {item.popular && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 py-0.5 px-2 rounded-full">
                      Populaire
                    </span>
                  )}
                  {item.vegetarian && (
                    <span className="text-xs bg-green-100 text-green-800 py-0.5 px-2 rounded-full">
                      Végétarien
                    </span>
                  )}
                  {item.spicy && (
                    <span className="text-xs bg-red-100 text-red-800 py-0.5 px-2 rounded-full">
                      Épicé
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col items-end">
                <span className="font-medium">{formatPrice(item.price)}</span>
                
                {showAddButton && (
                  <Button 
                    size="sm"
                    variant="ghost"
                    className="mt-2 hover:bg-primary/10 p-0"
                    onClick={handleAddToCart}
                  >
                    <PlusCircle className="h-5 w-5 mr-1" />
                    <span className="underline-offset-4 hover:underline text-sm">Ajouter</span>
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </div>
      </Card>

      {/* Modal de sélection d'accompagnement */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-medium">Choisissez votre accompagnement</h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-4">
              <p className="text-sm text-muted-foreground mb-4">
                Sélectionnez un accompagnement pour votre {item.name}
              </p>
              
              <div className="space-y-2">
                {availableSides.map((side) => (
                  <div 
                    key={side.id}
                    className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all ${
                      selectedSide?.id === side.id 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleSideSelection(side)}
                  >
                    <div className="flex items-center">
                      <div className={`h-5 w-5 rounded-full border mr-3 flex items-center justify-center ${
                        selectedSide?.id === side.id 
                          ? 'bg-green-500 border-green-500' 
                          : 'border-gray-300'
                      }`}>
                        {selectedSide?.id === side.id && (
                          <Check className="h-3 w-3 text-black" />
                        )}
                      </div>
                      <span className="text-black">{side.name}</span>
                    </div>
                    <span className="text-sm font-medium">{formatPrice(side.additionalPrice)}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Prix du plat:</span>
                  <span>{formatPrice(item.price)}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span>Accompagnement:</span>
                  <span>{selectedSide ? formatPrice(selectedSide.additionalPrice) : formatPrice(0)}</span>
                </div>
                <div className="flex justify-between items-center font-bold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span>{formatPrice(item.price + (selectedSide?.additionalPrice || 0))}</span>
                </div>
              </div>
              
              <Button 
                className="w-full mt-4 bg-green-600 hover:bg-green-700"
                onClick={confirmSelection}
                disabled={!selectedSide}
              >
                Confirmer la sélection
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'agrandissement d'image */}
      {isImageZoomed && (
        <div 
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-[60] p-4"
          onClick={closeImageZoom}
        >
          <div 
            className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={closeImageZoom}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10 bg-black/50 rounded-full p-2"
            >
              <X className="h-6 w-6" />
            </button>
            
            <div className="relative w-full h-full">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 90vw, 80vw"
              />
            </div>
            
            {/* Informations sous l'image agrandie */}
            <div className="absolute bottom-4 left-4 right-4 bg-black/70 text-white p-4 rounded-lg">
              <h3 className="text-lg font-bold">{item.name}</h3>
              <p className="text-sm text-gray-200 mt-1">{item.description}</p>
              <p className="text-lg font-semibold mt-2">{formatPrice(item.price)}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Données des catégories et éléments de menu
const categories: Category[] = [
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
    price: 9.99,
    image: wingi19,
    category: "poissons"
  },
  
  // nos accompagnements
  {
    id: "Attiéké",
    name: "Attiéké",
    description: "Semoule de manioc parfumée.",
    price: 5.00,
    image: wingi54,
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

// Composant principal
export default function MenuWithModal() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  const filteredItems = selectedCategory === "all" 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);
  
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Menu Wingi</h1>
          <p className="text-gray-600 mt-2">Découvrez nos délicieux plats et choisissez votre accompagnement préféré</p>
        </div>
        
        {/* Filtres de catégories */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            className={`px-4 py-2 rounded-full ${
              selectedCategory === "all" 
                ? "bg-green-600 text-white" 
                : "bg-white text-gray-700 border border-gray-300"
            }`}
            onClick={() => setSelectedCategory("all")}
          >
            Tous
          </button>
          {categories.map(category => (
            <button
              key={category.id}
              className={`px-4 py-2 rounded-full ${
                selectedCategory === category.id 
                  ? "bg-green-600 text-white" 
                  : "bg-white text-gray-700 border border-gray-300"
              }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
        
        {/* Liste des éléments du menu */}
        <div className="grid gap-6">
          {filteredItems.map((item) => (
            <MenuItemComponent key={item.id} item={item} showAddButton={true} />
          ))}
        </div>
        
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Pour les plats principaux, cliquez sur "Ajouter" pour choisir votre accompagnement</p>
          <p className="mt-2">👆 Cliquez sur les images pour les agrandir</p>
        </div>
      </div>
    </div>
  );
}