import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CateringService from "@/components/catering/CateringService";
import { cateringServices } from "@/lib/data";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Download, FileText } from "lucide-react";
export default function CateringPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Hero Banner */}
        <div className="relative reservation h-80 md:h-96 bg-slate-900">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg')",
              filter: "brightness(0.4)",
            }}
          ></div>
          <div className="relative h-full flex flex-col items-center justify-center text-white p-4 text-center">
            <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">
              Service traiteur
            </h1>
            <p className="max-w-2xl">
              Des prestations sur mesure pour vos événements professionnels et
              privés
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Button asChild size="lg" className="mt-6 rounded-full">
                <Link href="/catering/reservation">Réserver maintenant</Link>
              </Button>
              <div className="mt-0.5 flex justify-center">
                <a
                  href="pdf/service.pdf"
                  download
                  className="
                    group relative flex items-center gap-3 px-8 py-4 
                    bg-gradient-to-r from-green-600 to-green-500 
                    text-white font-bold rounded-2xl
                    shadow-[0_10px_20px_-10px_rgba(22,163,74,0.5)]
                    hover:shadow-[0_20px_25px_-5px_rgba(22,163,74,0.4)]
                    transition-all duration-300 hover:-translate-y-1 active:scale-95
                  "
                >
                  {/* Icône de fichier */}
                  <FileText className="h-5 w-5 text-green-100" />

                  <span>Télécharger notre menu complet</span>

                  {/* Icône de téléchargement qui rebondit au survol */}
                  <Download className="h-5 w-5 transition-transform duration-300 group-hover:translate-y-1" />
                  {/* Effet de brillance au survol */}
                  <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </div>
            </div>
          </div>
        </div>
        {/* Services Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-serif font-semibold mb-2">
                Nos prestations
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Du cocktail d&apos;entreprise au mariage, nous proposons des
                formules adaptées à tous vos événements.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {cateringServices.map((service) => (
                <CateringService key={service.id} service={service} />
              ))}
            </div>
          </div>
        </section>
        {/* Why Choose Us */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-serif font-semibold mb-2">
                Pourquoi nous choisir ?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Une équipe de professionnels à votre service pour faire de votre
                événement un moment inoubliable.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Image
                    src="https://images.pexels.com/photos/8472365/pexels-photo-8472365.jpeg"
                    alt="Quality"
                    width={32}
                    height={32}
                    className="rounded-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-medium mb-2">Qualité premium</h3>
                <p className="text-muted-foreground">
                  Des ingrédients frais et de saison, sélectionnés avec soin
                  pour une cuisine d&apos;exception.
                </p>
              </div>

              <div className="bg-card p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Image
                    src="https://images.pexels.com/photos/3787752/pexels-photo-3787752.jpeg"
                    alt="Customization"
                    width={32}
                    height={32}
                    className="rounded-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-medium mb-2">Sur mesure</h3>
                <p className="text-muted-foreground">
                  Des prestations entièrement personnalisables selon vos envies,
                  contraintes et budget.
                </p>
              </div>

              <div className="bg-card p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Image
                    src="https://images.pexels.com/photos/1619857/pexels-photo-1619857.jpeg"
                    alt="Experience"
                    width={32}
                    height={32}
                    className="rounded-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-medium mb-2">Expérience</h3>
                <p className="text-muted-foreground">
                  Plus de 10 ans d&apos;expérience dans l&apos;organisation
                  d&apos;événements de toutes tailles.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-card relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-serif font-semibold mb-4">
                Prêt à organiser votre événement ?
              </h2>
              <p className="text-muted-foreground mb-8">
                Contactez-nous dès maintenant pour discuter de votre projet et
                obtenir un devis personnalisé.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="rounded-full">
                  <Link href="/catering/reservation">Demander un devis</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="rounded-full"
                >
                  <Link href="/contact">Nous contacter</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Decorative Element */}
          <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-primary/5 rounded-full" />
          <div className="absolute -top-16 -left-16 w-64 h-64 bg-primary/5 rounded-full" />
        </section>
      </main>
      <Footer />
    </>
  );
}
