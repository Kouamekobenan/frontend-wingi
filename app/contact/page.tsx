import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PhoneCall, Mail, MapPin, Clock } from "lucide-react";

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-3xl font-serif font-semibold mb-2">Contact</h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Nous sommes à votre disposition pour répondre à toutes vos questions et prendre vos réservations.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Contact Information */}
              <div>
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-medium mb-6">Informations de contact</h2>
                    
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center shrink-0">
                          <MapPin className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium mb-1">Adresse</h3>
                          <p className="text-muted-foreground">
                            24 Rue des Gourmets<br />
                            75008 Paris, France
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4">
                        <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center shrink-0">
                          <PhoneCall className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium mb-1">Téléphone</h3>
                          <p className="text-muted-foreground">
                            +33 1 42 68 95 04
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4">
                        <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center shrink-0">
                          <Mail className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium mb-1">Email</h3>
                          <p className="text-muted-foreground">
                            info@legourmet.fr
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4">
                        <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center shrink-0">
                          <Clock className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium mb-1">Horaires d'ouverture</h3>
                          <p className="text-muted-foreground">
                            Lundi - Vendredi: 11:00 - 22:00<br />
                            Samedi: 11:00 - 23:00<br />
                            Dimanche: 12:00 - 21:00
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Map */}
                <div className="mt-8 aspect-[4/3] rounded-lg overflow-hidden">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.142647335839!2d2.3002184156744847!3d48.87456857928886!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66fc4a2d60aff%3A0xd5ab8a3826c34384!2s24%20Rue%20des%20Mathurins%2C%2075009%20Paris%2C%20France!5e0!3m2!1sen!2sus!4v1623156417436!5m2!1sen!2sus" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen 
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
              
              {/* Contact Form */}
              <div>
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-medium mb-6">Envoyez-nous un message</h2>
                    
                    <form className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label htmlFor="name" className="text-sm font-medium">
                            Nom
                          </label>
                          <Input id="name" placeholder="Votre nom" />
                        </div>
                        
                        <div className="space-y-2">
                          <label htmlFor="email" className="text-sm font-medium">
                            Email
                          </label>
                          <Input id="email" placeholder="votre@email.com" type="email" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="subject" className="text-sm font-medium">
                          Sujet
                        </label>
                        <Input id="subject" placeholder="Sujet de votre message" />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="message" className="text-sm font-medium">
                          Message
                        </label>
                        <Textarea 
                          id="message" 
                          placeholder="Votre message"
                          rows={6}
                          className="resize-none"
                        />
                      </div>
                      
                      <Button type="submit" className="w-full" size="lg">
                        Envoyer le message
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}