"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion"; // Import pour les animations
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, X, Check, ZoomIn, Clock } from "lucide-react";
import { useCart } from "@/lib/cart";
import { DishRepositorty } from "@/app/backend/module/dishes/infrastructure/dish.repository";
import { FindAllDishUseCase } from "@/app/backend/module/dishes/application/usecases/find-all-dish.usecase";
import { Dish } from "@/app/backend/module/dishes/entities/dish.entity";
import { CategoryRepository } from "@/app/backend/module/categories/infrastructure/category.repository";
import { CategorieService } from "@/app/backend/module/categories/application/usecases/category.service";
import { Category } from "@/app/backend/module/categories/domain/entities/category";

const dishRepo = new DishRepositorty();
const findAllDishUseCase = new FindAllDishUseCase(dishRepo);
const catRepo = new CategoryRepository();
const categoryServices = new CategorieService(catRepo);

interface Side {
  id: string;
  name: string;
  additionalPrice: number;
}

const availableSides: Side[] = [
  { id: "Attiéké", name: "Attiéké", additionalPrice: 5 },
  { id: "Alloco", name: "Alloco", additionalPrice: 5 },
  { id: "Ablo", name: "Ablo (x6)", additionalPrice: 5 },
  { id: "Frites d'igname", name: "Frites d'igname", additionalPrice: 5 },
];

const formatPrice = (price: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
    price,
  );

const SIDES_REQUIRED_NAMES = ["Viandes", "Volailles", "Poissons"];

// ─── MenuItemComponent ────────────────────────────────────────────────────────
function MenuItemComponent({
  item,
  showAddButton = false,
  requiresSide = false,
  index,
}: {
  item: Dish;
  showAddButton?: boolean;
  requiresSide?: boolean;
  index: number;
}) {
  const { addItem } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSide, setSelectedSide] = useState<Side | null>(null);
  const [isImageZoomed, setIsImageZoomed] = useState(false);

  const handleAddToCart = () => {
    if (requiresSide) {
      setIsModalOpen(true);
    } else {
      addItem(item, 1);
    }
  };

  const confirmSelection = () => {
    const totalPrice = item.price + (selectedSide?.additionalPrice || 0);
    const itemWithSide = {
      ...item,
      price: totalPrice,
      name: selectedSide ? `${item.name} avec ${selectedSide.name}` : item.name,
      selectedSide: selectedSide || undefined,
    };
    addItem(itemWithSide, 1);
    setIsModalOpen(false);
    setSelectedSide(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Card className="group h-full overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-300 bg-white flex flex-col">
        {/* Image avec Overlay Zoom */}
        <div
          className="relative aspect-[4/3] sm:aspect-video overflow-hidden cursor-zoom-in"
          onClick={() => setIsImageZoomed(true)}
        >
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 640px) 50vw, 400px"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
            <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100" />
          </div>
          <div className="absolute top-2 right-2">
            <span className="flex items-center gap-1 text-[10px] font-bold bg-white/90 backdrop-blur-md px-2 py-1 rounded-full shadow-sm text-gray-700">
              <Clock className="h-3 w-3" /> {item.preparationTime} min
            </span>
          </div>
        </div>

        <CardContent className="p-3 sm:p-5 flex flex-col flex-grow">
          <div className="flex-grow">
            <h3 className="text-sm sm:text-xl font-bold text-gray-900 line-clamp-1">
              {item.name}
            </h3>
            <p className="text-[11px] sm:text-sm text-gray-500 mt-1 line-clamp-2 leading-relaxed">
              {item.description}
            </p>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-base sm:text-xl font-black text-green-600">
                {formatPrice(item.price)}
              </span>
            </div>

            {showAddButton && item.isAvailable ? (
              <Button
                onClick={handleAddToCart}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl h-10 sm:h-12 shadow-md hover:shadow-green-200 transition-all active:scale-95 flex gap-2"
              >
                <PlusCircle className="h-5 w-5" />
                <span>Ajouter</span>
              </Button>
            ) : (
              !item.isAvailable && (
                <div className="w-full text-center py-2 bg-gray-100 text-gray-400 text-xs font-bold rounded-xl uppercase tracking-tighter">
                  Indisponible
                </div>
              )
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modal Accompagnement */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden"
            >
              <div className="relative p-6 border-b text-center">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute right-4 top-4 p-1 hover:bg-gray-100 rounded-full"
                >
                  <X className="h-6 w-6 text-gray-400" />
                </button>
                <h3 className="text-xl font-bold">Accompagnement</h3>
                <p className="text-sm text-gray-500">Pour votre {item.name}</p>
              </div>
              <div className="p-6 space-y-3">
                {availableSides.map((side) => (
                  <div
                    key={side.id}
                    className={`flex items-center justify-between p-4 border-2 rounded-2xl cursor-pointer transition-all ${
                      selectedSide?.id === side.id
                        ? "border-green-500 bg-green-50/50"
                        : "border-gray-100 hover:border-gray-200"
                    }`}
                    onClick={() => setSelectedSide(side)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${selectedSide?.id === side.id ? "bg-green-500 border-green-500" : "border-gray-300"}`}
                      >
                        {selectedSide?.id === side.id && (
                          <Check className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <span className="font-semibold text-gray-700">
                        {side.name}
                      </span>
                    </div>
                    <span className="text-green-600 font-bold">
                      +{formatPrice(side.additionalPrice)}
                    </span>
                  </div>
                ))}

                <Button
                  className="w-full mt-6 bg-green-600 hover:bg-green-700 h-14 rounded-2xl text-lg font-bold shadow-lg"
                  onClick={confirmSelection}
                  disabled={!selectedSide}
                >
                  Confirmer
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Zoom Image */}
      {isImageZoomed && (
        <div
          className="fixed inset-0 bg-black/95 z-[110] flex items-center justify-center p-4"
          onClick={() => setIsImageZoomed(false)}
        >
          <div className="relative w-full max-w-4xl aspect-square sm:aspect-video">
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
              className="object-contain"
            />
          </div>
          <button className="absolute top-6 right-6 text-white bg-white/10 p-3 rounded-full backdrop-blur-md">
            <X className="h-8 w-8" />
          </button>
        </div>
      )}
    </motion.div>
  );
}

// ─── Composant principal ──────────────────────────────────────────────────────
export default function MenuWithModal() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dishesData, categoriesData] = await Promise.all([
          findAllDishUseCase.execute(),
          categoryServices.findAll(),
        ]);
        setDishes(dishesData);
        setCategories(categoriesData.filter((cat) => cat.isActive));
      } catch (error) {
        console.error("Erreur chargement", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const sidesRequiredIds = categories
    .filter((cat) => SIDES_REQUIRED_NAMES.includes(cat.name))
    .map((cat) => cat.id);

  const filteredDishes =
    selectedCategory === "all"
      ? dishes
      : dishes.filter((dish) => dish.categoryId === selectedCategory);

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight"
          >
            Menu <span className="text-green-600">Wingi</span>
          </motion.h1>
          <p className="text-gray-500 mt-3 text-lg">
            Saveurs authentiques à portée de clic
          </p>
        </header>

        {/* Filtres */}
        <div className="flex flex-wrap justify-center gap-3 mb-12 overflow-x-auto pb-4 no-scrollbar">
          <button
            className={`px-6 py-2.5 rounded-full font-bold transition-all whitespace-nowrap shadow-sm ${
              selectedCategory === "all"
                ? "bg-green-600 text-white shadow-green-200"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
            onClick={() => setSelectedCategory("all")}
          >
            Tous les plats
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`px-6 py-2.5 rounded-full font-bold transition-all whitespace-nowrap shadow-sm ${
                selectedCategory === cat.id
                  ? "bg-green-600 text-white shadow-green-200"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Liste des plats - GRID 2 COLONNES MOBILE */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="h-12 w-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-400 font-medium">Préparation du menu...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
            <AnimatePresence mode="popLayout">
              {filteredDishes.map((dish, index) => (
                <MenuItemComponent
                  key={dish.id}
                  index={index}
                  item={dish}
                  showAddButton={true}
                  requiresSide={sidesRequiredIds.includes(dish.categoryId)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        {filteredDishes.length === 0 && !loading && (
          <div className="text-center py-20 bg-white rounded-3xl shadow-inner mt-10">
            <p className="text-gray-400 text-lg">
              Aucun plat dans cette catégorie.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
