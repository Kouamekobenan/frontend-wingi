import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import chefKatia from "@/images/chef/chefKatia.jpg";
import img2 from "@/images/menu/img2.png";

export default function AboutSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative w-full h-[600px] rounded-lg overflow-hidden">
            <Image
              src={chefKatia}
              alt="Chef preparing food"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          
          <div>
            <h2 className="text-3xl font-serif font-semibold mb-6">Notre histoire</h2>
            <p className="text-muted-foreground mb-4">
              Tout commence le 9 février 2021, lorsque Chef Abrema, passionnée par la cuisine africaine, se lance dans une aventure culinaire en revisitant un plat emblématique : l&apos;Abolo. Elle crée alors son premier restaurant en ligne sous le nom Chez Tantie Abolo.
            </p>


               									



            <p className="text-muted-foreground mb-4">
              Le succès de l&apos;Abolo inspire Tantie Abolo à élargir son offre. Elle se spécialise dans le barbecue traditionnel au feu de bois et au charbon, sublimé par des épices africaines authentiques.

Forte de cette expertise, Tantie Abolo signe sa première prestation traiteur en Île-de-France, en assurant le service d&apos;un mariage de 150 personnes.
            </p>
            <p className="text-muted-foreground mb-6">
              L&apos;ambition grandit. Tantie Abolo évolue et devient Wingi, qui signifie "abondance" en swahili. Ce changement incarne une vision plus large, tournée vers la richesse et la diversité de la gastronomie africaine.

Wingi organise prochainement son premier événement annuel (nom à venir), en collaboration avec SEM, et s&apos;engage dans des actions solidaires, comme sa participation à la Journée de lutte contre le cancer du sein, où 150 repas ont été offerts.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                  <Image
                    src={img2}
                    alt="Fresh ingredients"
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Produits frais & locaux</h3>
                  <p className="text-muted-foreground text-sm">Sélectionnés chez les meilleurs producteurs</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                  <Image
                    src={chefKatia}
                    alt="Professional team"
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Équipe passionnée</h3>
                  <p className="text-muted-foreground text-sm">Des experts de la gastronomie à votre service</p>
                </div>
              </div>
            </div>
            
            <Button asChild className="mt-8 rounded-full">
              <Link href="/contact">Nous contacter</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}