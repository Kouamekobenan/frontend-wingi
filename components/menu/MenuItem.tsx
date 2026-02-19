"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, X, Check, ZoomIn } from "lucide-react";
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

// Noms des catégories qui nécessitent un accompagnement
const SIDES_REQUIRED_NAMES = ["Viandes", "Volailles", "Poissons"];

// ─── MenuItemComponent ────────────────────────────────────────────────────────
function MenuItemComponent({
  item,
  showAddButton = false,
  requiresSide = false,
}: {
  item: Dish;
  showAddButton?: boolean;
  requiresSide?: boolean; // calculé dans le parent
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

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSide(null);
  };

  return (
    <>
      <Card className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="grid sm:grid-cols-[120px_1fr] gap-4">
          <div
            className="relative h-52 sm:h-full overflow-hidden group cursor-zoom-in"
            onClick={() => setIsImageZoomed(true)}
          >
            <Image
              src={item.imageUrl ?? "../../images/menu/img11.png"}
              alt={item.name}
              fill
              className="object-cover transition-transform duration-300 ease-in-out hover:scale-105"
              sizes="(max-width: 640px) 100vw, 120px"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
              <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>

          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium font-serif">{item.name}</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-2 line-clamp-2">
                  {item.description}
                </p>
                <span className="text-xs bg-muted text-muted-foreground py-0.5 px-2 rounded-full">
                  ⏱ {item.preparationTime} min
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-medium">{formatPrice(item.price)}</span>
                {showAddButton && item.isAvailable && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="mt-2 hover:bg-primary/10 p-0"
                    onClick={handleAddToCart}
                  >
                    <PlusCircle className="h-5 w-5 mr-1" />
                    <span className="underline-offset-4 hover:underline text-sm">
                      Ajouter
                    </span>
                  </Button>
                )}
                {!item.isAvailable && (
                  <span className="text-xs text-red-500 mt-2">
                    Indisponible
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </div>
      </Card>

      {/* Modal accompagnement */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-medium">
                Choisissez votre accompagnement
              </h3>
              <button onClick={closeModal}>
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
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedSide(side)}
                  >
                    <div className="flex items-center">
                      <div
                        className={`h-5 w-5 rounded-full border mr-3 flex items-center justify-center ${
                          selectedSide?.id === side.id
                            ? "bg-green-500 border-green-500"
                            : "border-gray-300"
                        }`}
                      >
                        {selectedSide?.id === side.id && (
                          <Check className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <span>{side.name}</span>
                    </div>
                    <span className="text-sm font-medium">
                      {formatPrice(side.additionalPrice)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Prix du plat:</span>
                  <span>{formatPrice(item.price)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Accompagnement:</span>
                  <span>{formatPrice(selectedSide?.additionalPrice || 0)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span>
                    {formatPrice(
                      item.price + (selectedSide?.additionalPrice || 0),
                    )}
                  </span>
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

      {/* Modal zoom image */}
      {isImageZoomed && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-[60] p-4"
          onClick={() => setIsImageZoomed(false)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsImageZoomed(false)}
              className="absolute top-4 right-4 text-white z-10 bg-black/50 rounded-full p-2"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="relative w-full h-full">
              <Image
                src={item.imageUrl}
                alt={item.name}
                fill
                className="object-contain"
                sizes="90vw"
              />
            </div>
            <div className="absolute bottom-4 left-4 right-4 bg-black/70 text-white p-4 rounded-lg">
              <h3 className="text-lg font-bold">{item.name}</h3>
              <p className="text-sm text-gray-200 mt-1">{item.description}</p>
              <p className="text-lg font-semibold mt-2">
                {formatPrice(item.price)}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
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
        // On garde uniquement les catégories actives
        setCategories(categoriesData.filter((cat) => cat.isActive));
      } catch (error) {
        console.error("Erreur lors du chargement", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Ids des catégories nécessitant un accompagnement, basé sur le nom en BD
  const sidesRequiredIds = categories
    .filter((cat) => SIDES_REQUIRED_NAMES.includes(cat.name))
    .map((cat) => cat.id);

  const filteredDishes =
    selectedCategory === "all"
      ? dishes
      : dishes.filter((dish) => dish.categoryId === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Menu Wingi</h1>
          <p className="text-gray-600 mt-2">
            Découvrez nos délicieux plats et choisissez votre accompagnement
            préféré
          </p>
        </div>

        {/* Filtres — 100% dynamiques depuis l'API */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            className={`px-4 py-2 rounded-full transition-colors ${
              selectedCategory === "all"
                ? "bg-green-600 text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:border-green-400"
            }`}
            onClick={() => setSelectedCategory("all")}
          >
            Tous
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`px-4 py-2 rounded-full transition-colors ${
                selectedCategory === cat.id
                  ? "bg-green-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:border-green-400"
              }`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Liste des plats */}
        {loading ? (
          <div className="text-center py-16 text-gray-500">
            Chargement du menu...
          </div>
        ) : filteredDishes.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            Aucun plat disponible dans cette catégorie.
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredDishes.map((dish) => (
              <MenuItemComponent
                key={dish.id}
                item={dish}
                showAddButton={true}
                requiresSide={sidesRequiredIds.includes(dish.categoryId)}
              />
            ))}
          </div>
        )}

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Pour les plats principaux, cliquez sur Ajouter pour choisir votre
            accompagnement
          </p>
          <p className="mt-2">👆 Cliquez sur les images pour les agrandir</p>
        </div>
      </div>
    </div>
  );
}
