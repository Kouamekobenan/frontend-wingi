import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CateringService as CateringServiceType } from "@/types";
import { Users } from "lucide-react";

interface CateringServiceProps {
  service: CateringServiceType;
  
}

export default function CateringService({ service }: CateringServiceProps) {
  return (
    <Card className="group overflow-hidden border-none shadow-md transition-all duration-300 hover:shadow-xl">
      <div className="relative h-60 overflow-hidden">
        <Image
          src={service.image}
          alt={service.name}
          fill
          className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-white text-xl font-medium font-serif mb-1">{service.name}</h3>
        </div>
      </div>
      
      <CardContent className="p-5">
        <p className="text-muted-foreground mb-4">{service.description}</p>
        <div className="flex flex-wrap justify-between items-center mb-6">
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="h-4 w-4 mr-1" />
            <span>{service.minGuests} - {service.maxGuests} invités</span>
          </div>
        </div>
        <div className="flex justify-center">
          <Button asChild className="w-full">
            <Link href="/catering/reservation">
              Réserver
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}