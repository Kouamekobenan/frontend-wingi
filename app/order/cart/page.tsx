"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartItem from "@/components/order/CartItem";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCart } from "@/lib/cart";
import { calculateCartTotal, formatPrice } from "@/lib/utils";
import { ArrowLeft, CreditCard, MapPin, Clock, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// CONFIGURATION: Numéro WhatsApp du fournisseur (format international sans +)
const WHATSAPP_NUMBER = "22506832678"; // Remplacez par le numéro du fournisseur

export default function CheckoutPage() {
  const { items, clearCart } = useCart();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState("delivery");
  const [paymentMethod, setPaymentMethod] = useState("card");

  // États pour les informations du formulaire
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    zipCode: "",
    instructions: "",
    email: "",
    phone: "",
    cardNumber: "",
    expiry: "",
    cvc: ""
  });

  const cartTotal = calculateCartTotal(items);
  const deliveryFee = deliveryMethod === "delivery" ? 10.00 : 0;
  const totalWithDelivery = cartTotal + deliveryFee;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const formatWhatsAppMessage = () => {
    let message = "🛍️ *NOUVELLE COMMANDE*\n\n";
    
    // Informations de contact
    message += "👤 *Client:*\n";
    if (deliveryMethod === "delivery") {
      message += `${formData.firstName} ${formData.lastName}\n`;
    }
    message += `📧 Email: ${formData.email}\n`;
    message += `📱 Tél: ${formData.phone}\n\n`;

    // Mode de livraison
    message += "🚚 *Livraison:*\n";
    if (deliveryMethod === "delivery") {
      message += `Mode: Livraison à domicile\n`;
      message += `Adresse: ${formData.address}\n`;
      message += `Ville: ${formData.city}\n`;
      message += `Code postal: ${formData.zipCode}\n`;
      if (formData.instructions) {
        message += `Instructions: ${formData.instructions}\n`;
      }
    } else {
      message += `Mode: Retrait en magasin\n`;
    }
    message += "\n";

    // Articles commandés
    message += "🍽️ *Articles:*\n";
    items.forEach((item) => {
      message += `• ${item.quantity}x ${item.menuItem.name} - ${formatPrice(item.menuItem.price * item.quantity)}\n`;
    });
    message += "\n";

    // Récapitulatif financier
    message += "💰 *Récapitulatif:*\n";
    message += `Sous-total: ${formatPrice(cartTotal)}\n`;
    if (deliveryMethod === "delivery") {
      message += `Frais de livraison: ${formatPrice(deliveryFee)}\n`;
    }
    message += `*TOTAL: ${formatPrice(totalWithDelivery)}*\n\n`;

    // Méthode de paiement
    message += "💳 *Paiement:*\n";
    if (paymentMethod === "card") {
      message += `Mode: Carte bancaire\n`;
      message += `Carte: **** **** **** ${formData.cardNumber.slice(-4)}\n`;
    } else {
      message += `Mode: Paiement à la livraison\n`;
    }

    return message;
  };

  const sendWhatsAppMessage = () => {
    const message = formatWhatsAppMessage();
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    
    // Ouvrir WhatsApp dans un nouvel onglet
    window.open(whatsappUrl, '_blank');
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validation basique
    if (!formData.email || !formData.phone) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    if (deliveryMethod === "delivery" && (!formData.firstName || !formData.lastName || !formData.address || !formData.city || !formData.zipCode)) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir toutes les informations de livraison.",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    // Simulation d'un délai de traitement
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Envoyer le message WhatsApp
    sendWhatsAppMessage();

    toast({
      title: "Commande confirmée !",
      description: "Votre commande a été envoyée au restaurant via WhatsApp.",
    });

    clearCart();
    setIsSubmitting(false);
  };

  if (items.length === 0) {
    return (
      <>
        <Header />
        <main className="pt-24 pb-20">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle2 className="h-16 w-16 text-green-500" />
              </div>
              <h1 className="text-2xl font-serif font-semibold mb-2">Commande validée</h1>
              <p className="text-muted-foreground mb-6">
                Votre commande a été traitée avec succès. Merci pour votre confiance !
              </p>
              <Button asChild size="lg">
                <Link href="/order">
                  Retour au menu
                </Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Breadcrumb */}
            <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
              <Link href="/order" className="hover:text-foreground">Menu</Link>
              <span>›</span>
              <Link href="/cart" className="hover:text-foreground">Panier</Link>
              <span>›</span>
              <span className="text-foreground">Validation</span>
            </nav>

            <h1 className="text-3xl font-serif font-semibold mb-2">Validation de commande</h1>
            <p className="text-muted-foreground mb-8">
              Finalisez votre commande en remplissant vos informations
            </p>

            <form onSubmit={handleSubmitOrder}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Forms */}
                <div className="space-y-8">
                  {/* Delivery Method */}
                  <div className="bg-card border rounded-lg p-6">
                    <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Mode de livraison
                    </h2>
                    <RadioGroup value={deliveryMethod} onValueChange={setDeliveryMethod} className="space-y-4">
                      <div className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-accent/50 cursor-pointer">
                        <RadioGroupItem value="delivery" id="delivery" />
                        <Label htmlFor="delivery" className="flex-1 cursor-pointer">
                          <div className="font-medium">Livraison à domicile</div>
                          <div className="text-sm text-muted-foreground">Frais de livraison: {formatPrice(10)}</div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-accent/50 cursor-pointer">
                        <RadioGroupItem value="pickup" id="pickup" />
                        <Label htmlFor="pickup" className="flex-1 cursor-pointer">
                          <div className="font-medium">Retrait en magasin</div>
                          <div className="text-sm text-muted-foreground">Gratuit - Prêt dans 20-30 min</div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Delivery Address */}
                  {deliveryMethod === "delivery" && (
                    <div className="bg-card border rounded-lg p-6">
                      <h2 className="text-xl font-medium mb-4">Adresse de livraison</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">Prénom</Label>
                          <Input 
                            id="firstName" 
                            value={formData.firstName}
                            onChange={handleInputChange}
                            required 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Nom</Label>
                          <Input 
                            id="lastName" 
                            value={formData.lastName}
                            onChange={handleInputChange}
                            required 
                          />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                          <Label htmlFor="address">Adresse</Label>
                          <Input 
                            id="address" 
                            value={formData.address}
                            onChange={handleInputChange}
                            required 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="city">Ville</Label>
                          <Input 
                            id="city" 
                            value={formData.city}
                            onChange={handleInputChange}
                            required 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="zipCode">Code postal</Label>
                          <Input 
                            id="zipCode" 
                            value={formData.zipCode}
                            onChange={handleInputChange}
                            required 
                          />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                          <Label htmlFor="instructions">Instructions de livraison (optionnel)</Label>
                          <Textarea 
                            id="instructions" 
                            value={formData.instructions}
                            onChange={handleInputChange}
                            placeholder="Code, étage, informations supplémentaires..." 
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  {/* Contact Information */}
                  <div className="bg-card border rounded-lg p-6">
                    <h2 className="text-xl font-medium mb-4">Informations de contact</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          value={formData.email}
                          onChange={handleInputChange}
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Téléphone</Label>
                        <Input 
                          id="phone" 
                          type="tel" 
                          value={formData.phone}
                          onChange={handleInputChange}
                          required 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="bg-card border rounded-lg p-6">
                    <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Paiement
                    </h2>
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                      <div className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-accent/50 cursor-pointer">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="flex-1 cursor-pointer">
                          <div className="font-medium">Carte bancaire</div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-accent/50 cursor-pointer">
                        <RadioGroupItem value="cash" id="cash" />
                        <Label htmlFor="cash" className="flex-1 cursor-pointer">
                          <div className="font-medium">Paiement à la livraison</div>
                        </Label>
                      </div>
                    </RadioGroup>

                    {paymentMethod === "card" && (
                      <div className="mt-4 space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="cardNumber">Numéro de carte</Label>
                          <Input 
                            id="cardNumber" 
                            value={formData.cardNumber}
                            onChange={handleInputChange}
                            placeholder="1234 5678 9012 3456" 
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="expiry">Date d&apos;expiration</Label>
                            <Input 
                              id="expiry" 
                              value={formData.expiry}
                              onChange={handleInputChange}
                              placeholder="MM/AA" 
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cvc">CVC</Label>
                            <Input 
                              id="cvc" 
                              value={formData.cvc}
                              onChange={handleInputChange}
                              placeholder="123" 
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column - Order Summary */}
                <div className="space-y-6">
                  {/* Order Items */}
                  <div className="bg-card border rounded-lg p-6">
                    <h2 className="text-xl font-medium mb-4">Votre commande</h2>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {items.map((item) => (
                        <div key={item.menuItem.id} className="flex items-center justify-between py-2">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                              <span className="text-sm font-medium">{item.quantity}x</span>
                            </div>
                            <div>
                              <div className="font-medium">{item.menuItem.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {formatPrice(item.menuItem.price * item.quantity)}
                              </div>
                            </div>
                          </div>
                          <div className="font-medium">
                            {formatPrice(item.menuItem.price * item.quantity)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="bg-card border rounded-lg p-6">
                    <h2 className="text-xl font-medium mb-4">Récapitulatif</h2>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Sous-total</span>
                        <span>{formatPrice(cartTotal)}</span>
                      </div>
                      {deliveryMethod === "delivery" && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Frais de livraison</span>
                          <span>{formatPrice(deliveryFee)}</span>
                        </div>
                      )}
                      <Separator className="my-3" />
                      <div className="flex justify-between font-medium text-lg">
                        <span>Total</span>
                        <span>{formatPrice(totalWithDelivery)}</span>
                      </div>
                    </div>

                    {/* Estimated Time */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                      <Clock className="h-4 w-4" />
                      {deliveryMethod === "delivery" 
                        ? "Livraison estimée: 30-45 min" 
                        : "Prêt dans: 20-30 min"}
                    </div>
                    
                    <Button 
                      type="submit"
                      className="w-full gap-2" 
                      size="lg"
                      disabled={isSubmitting}
                    >
                      <CreditCard className="h-5 w-5" />
                      {isSubmitting ? "Traitement en cours..." : `Payer ${formatPrice(totalWithDelivery)}`}
                    </Button>

                    <div className="mt-4 text-center">
                      <Button variant="ghost" asChild className="gap-2">
                        <Link href="/cart">
                          <ArrowLeft className="h-4 w-4" />
                          Retour au panier
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}