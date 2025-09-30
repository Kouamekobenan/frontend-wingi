import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ReservationForm from "@/components/catering/ReservationForm";

export default function ReservationPage() {
  return (
    <>
      <Header />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-serif font-semibold mb-2">Demande de réservation</h1>
              <p className="text-muted-foreground">
                Remplissez le formulaire ci-dessous pour nous faire part de vos besoins et obtenir un devis personnalisé.
              </p>
            </div>
            
            <div className="bg-card border rounded-lg p-6 md:p-8">
              <ReservationForm />
            </div>
            
            <div className="mt-8 text-center text-sm text-muted-foreground">
              <p>
                Après réception de votre demande, notre équipe vous contactera dans les 24 heures 
                ouvrées pour discuter de vos besoins et vous proposer un devis personnalisé.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}