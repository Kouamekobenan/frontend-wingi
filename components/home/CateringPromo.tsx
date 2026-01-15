import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CateringPromo() {
  return (
    <section className="py-20 relative bg-card">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-serif font-semibold mb-2">Service traiteur</h2>
            <p className="text-muted-foreground text-lg mb-6">
              Pour tous vos événements professionnels et privés
            </p>
            
            <p className="text-muted-foreground mb-6">
              WINGI met son savoir-faire au service de vos événements. Mariages, 
              séminaires, cocktails d&apos;entreprise, dîners de gala... Nous créons avec vous 
              le menu parfait pour impressionner vos invités et faire de votre événement 
              un moment inoubliable.
            </p>
            
            <div className="space-y-6 mb-8">
              <div className="flex gap-4">
                <div className="h-1 w-1 bg-primary rounded-full mt-2.5 shrink-0"></div>
                <p>Organisation complète de votre réception</p>
              </div>
              <div className="flex gap-4">
                <div className="h-1 w-1 bg-primary rounded-full mt-2.5 shrink-0"></div>
                <p>Menus personnalisés selon vos envies et budget</p>
              </div>
              <div className="flex gap-4">
                <div className="h-1 w-1 bg-primary rounded-full mt-2.5 shrink-0"></div>
                <p>Service professionnel et attentionné</p>
              </div>
              <div className="flex gap-4">
                <div className="h-1 w-1 bg-primary rounded-full mt-2.5 shrink-0"></div>
                <p>De 10 à 250 convives</p>
              </div>
            </div>
            
            <Button asChild size="lg" className="rounded-full">
              <Link href="/catering">Découvrir nos prestations</Link>
            </Button>
          </div>
          
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg shadow-xl">
            <Image
              src="https://images.pexels.com/photos/1243337/pexels-photo-1243337.jpeg"
              alt="Service traiteur"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}