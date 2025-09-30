import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Category } from "@/types";

interface MenuCategoryProps {
  category: Category;
}

export default function MenuCategory({ category }: MenuCategoryProps) {
  return (
    <Card className="group overflow-hidden border-none shadow-md transition-all duration-300 hover:shadow-xl">
      <div className="relative h-64 overflow-hidden">
        <Image
          src={category.image}
          alt={category.name}
          fill
          className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-white text-xl font-medium font-serif mb-1">{category.name}</h3>
        </div>
      </div>
      
      <CardContent className="p-5">
        <p className="text-muted-foreground mb-4">{category.description}</p>
        <div className="flex justify-center">
          <Button asChild variant="outline">
            <Link href={`/menu#${category.id}`}>
              Découvrir
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}