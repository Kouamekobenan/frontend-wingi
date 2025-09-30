"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { MenuItem as MenuItemType, Side as SideType } from "@/types";
import { PlusCircle, X, Check } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useState } from "react";

interface MenuProductProps {
  item: MenuItemType;
  showAddButton?: boolean;
}

const availableSides: SideType[] = [
  { id: "Attiéké", name: "Attiéké", additionalPrice: 0 },
  { id: "Alloco", name: "Alloco", additionalPrice: 0 },
  { id: "Ablo", name: "Ablo (x6)", additionalPrice: 0 },
  { id: "Frites d'igname", name: "Frites d'igname", additionalPrice: 0 },
];

export default function MenuProduct({ item, showAddButton = false }: MenuProductProps) {
  const { addItem } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSide, setSelectedSide] = useState<SideType | null>(null);

  const handleAddToCart = () => {
    const isMainDish = ["viandes", "volailles", "poissons"].includes(item.category);
    
    if (isMainDish) {
      setIsModalOpen(true);
    } else {
      addItem(item, 1);
    }
  };

  const handleSideSelection = (side: SideType) => {
    setSelectedSide(side);
  };

  const confirmSelection = () => {
    if (selectedSide) {
      const itemWithSide = {
        ...item,
        side: selectedSide,
        name: `${item.name} avec ${selectedSide.name}`
      };
      addItem(itemWithSide, 1);
    } else {
      addItem(item, 1);
    }
    setIsModalOpen(false);
    setSelectedSide(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSide(null);
  };

  return (
    <>
      <Card className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="grid sm:grid-cols-[120px_1fr] gap-4">
          <div className="relative h-52 sm:h-full overflow-hidden">
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover transition-transform duration-300 ease-in-out hover:scale-105"
              sizes="(max-width: 640px) 100vw, 120px"
            />
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
                          <Check className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <span>{side.name}</span>
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
              >
                Confirmer la sélection
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}