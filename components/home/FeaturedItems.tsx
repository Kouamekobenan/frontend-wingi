"use client";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { ArrowRight, Sparkles } from "lucide-react";
import { DishRepositorty } from "@/app/backend/module/dishes/infrastructure/dish.repository";
import { FindAllDishUseCase } from "@/app/backend/module/dishes/application/usecases/find-all-dish.usecase";
import { useEffect, useState } from "react";
import { Dish } from "@/app/backend/module/dishes/entities/dish.entity";

const FEATURED_ITEMS_COUNT = 3;
const dishRepository = new DishRepositorty();
const findAllDishUseCase = new FindAllDishUseCase(dishRepository);

export default function FeaturedItems() {
  const [dishes, setDishes] = useState<Dish[]>([]);

  const fetchDishData = async () => {
    try {
      const response = await findAllDishUseCase.execute();
      setDishes(response);
    } catch (error) {
      console.log("Error during retrieve data dish", error);
    }
  };

  useEffect(() => {
    fetchDishData();
  }, []);

  // On prend uniquement les 3 premiers plats disponibles
  const featuredDishes = dishes
    .filter((dish: Dish) => dish.isAvailable)
    .slice(0, FEATURED_ITEMS_COUNT);

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />

      <div className="container relative mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Plats signatures</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-serif font-bold tracking-tight">
            Nos spécialités
          </h2>

          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Découvrez les plats signatures de notre chef, préparés avec passion
            et des ingrédients de qualité exceptionnelle.
          </p>
        </div>

        {/* Grille des plats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {featuredDishes.map((dish: Dish, index: number) => (
            <Card
              key={dish.id}
              className="group relative overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all duration-500 bg-card"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Image */}
              <div className="relative h-72 overflow-hidden bg-muted">
                <Image
                  src={dish.imageUrl}
                  alt={dish.name}
                  fill
                  priority={index === 0}
                  className="object-cover transition-all duration-700 ease-out group-hover:scale-110 group-hover:rotate-1"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Badge prix */}
                <div className="absolute top-4 right-4 bg-background/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg transform translate-x-2 group-hover:translate-x-0 transition-transform duration-300">
                  <span className="text-primary font-bold text-lg">
                    {formatPrice(dish.price)}
                  </span>
                </div>
              </div>

              {/* Contenu */}
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <h3 className="text-2xl font-serif font-semibold tracking-tight group-hover:text-primary transition-colors duration-300">
                    {dish.name}
                  </h3>

                  <p className="text-muted-foreground leading-relaxed line-clamp-2">
                    {dish.description}
                  </p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  {/* Badge temps de préparation */}
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-muted text-muted-foreground py-1.5 px-3 rounded-full">
                    ⏱ {dish.preparationTime} min
                  </span>

                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="group/btn hover:bg-primary/10 hover:text-primary transition-all duration-300"
                  >
                    <Link
                      href={`/order#${dish.id}`}
                      className="flex items-center gap-2"
                    >
                      <span className="font-medium">Commander</span>
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button
            asChild
            size="lg"
            className="rounded-full px-8 py-6 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <Link href="/menu" className="flex items-center gap-2">
              <span>Voir tout le menu</span>
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
