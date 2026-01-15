// components/menu/product-card.tsx
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { MenuItem } from "@/types"; // Optionnel: définit ton interface

interface ProductCardProps {
  item: MenuItem;
}

export function ProductCard({ item }: ProductCardProps) {
  return (
    <Card className="group overflow-hidden border-none shadow-md transition-all duration-300 hover:shadow-xl">
      <div className="relative h-60 overflow-hidden">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-medium font-serif">{item.name}</h3>
          <span className="text-primary font-medium">
            {formatPrice(item.price)}
          </span>
        </div>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {item.description}
        </p>

        <div className="flex justify-between items-center">
          {item.vegetarian && (
            <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 py-1 px-2 rounded-full">
              Végétarien
            </span>
          )}
          <Button
            asChild
            variant="ghost"
            className="ml-auto hover:bg-primary/10 p-0 h-auto"
          >
            <Link
              href={`/order#${item.id}`}
              className="flex items-center gap-1 py-1"
            >
              <span className="underline-offset-4 hover:underline">
                Commander
              </span>
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
