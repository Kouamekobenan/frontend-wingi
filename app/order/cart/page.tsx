"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCart } from "@/lib/cart";
import { calculateCartTotal, formatPrice } from "@/lib/utils";
import {
  ArrowLeft,
  CreditCard,
  MapPin,
  Clock,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// CONFIGURATION: Numéro WhatsApp du fournisseur (format international sans +)
const WHATSAPP_NUMBER = "22506832678"; // Remplacez par le numéro du fournisseur

export default function CheckoutPage() {
  const { items, clearCart, updateQuantity, removeItem } = useCart();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState("delivery");
  const [paymentMethod,] = useState("card");

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
    cvc: "",
  });

  const cartTotal = calculateCartTotal(items);
  const deliveryFee = deliveryMethod === "delivery" ? 10.0 : 0;
  const totalWithDelivery = cartTotal + deliveryFee;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemoveItem(itemId);
      return;
    }
    updateQuantity(itemId, newQuantity);
  };

  const handleRemoveItem = (itemId: string) => {
    removeItem(itemId);
    toast({
      title: "Article retiré",
      description: "L'article a été retiré de votre panier.",
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
      message += `• ${item.quantity}x ${item.menuItem.name} - ${formatPrice(
        item.menuItem.price * item.quantity
      )}\n`;
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
    window.open(whatsappUrl, "_blank");
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validation basique
    if (!formData.email || !formData.phone) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    if (
      deliveryMethod === "delivery" &&
      (!formData.firstName ||
        !formData.lastName ||
        !formData.address ||
        !formData.city ||
        !formData.zipCode)
    ) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir toutes les informations de livraison.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    // Simulation d'un délai de traitement
    await new Promise((resolve) => setTimeout(resolve, 1000));

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
            <div className="max-w-2xl mx-auto text-center py-16">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
                  <ShoppingBag className="h-10 w-10 text-muted-foreground" />
                </div>
              </div>
              <h1 className="text-3xl font-serif font-semibold mb-3">
                Votre panier est vide
              </h1>
              <p className="text-muted-foreground mb-8 text-lg">
                Découvrez nos délicieuses spécialités et commencez votre
                commande.
              </p>
              <Button asChild size="lg" className="rounded-full">
                <Link href="/order">Voir le menu</Link>
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
      <main className="pt-24 pb-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Breadcrumb */}
            <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
              <Link
                href="/order"
                className="hover:text-foreground transition-colors"
              >
                Menu
              </Link>
              <span>›</span>
              <Link
                href="/cart"
                className="hover:text-foreground transition-colors"
              >
                Panier
              </Link>
              <span>›</span>
              <span className="text-foreground font-medium">Validation</span>
            </nav>

            <div className="mb-8">
              <h1 className="text-4xl font-serif font-bold mb-3">
                Validation de commande
              </h1>
              <p className="text-muted-foreground text-lg">
                Finalisez votre commande en remplissant vos informations
              </p>
            </div>

            <form onSubmit={handleSubmitOrder}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Forms */}
                <div className="space-y-6">
                  {/* Delivery Method */}
                  <div className="bg-card border rounded-xl p-6 shadow-sm">
                    <h2 className="text-xl font-semibold mb-5 flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      Mode de livraison
                    </h2>
                    <RadioGroup
                      value={deliveryMethod}
                      onValueChange={setDeliveryMethod}
                      className="space-y-3"
                    >
                      <div className="flex items-center space-x-3 border-2 rounded-xl p-4 hover:border-primary/50 hover:bg-accent/30 cursor-pointer transition-all">
                        <RadioGroupItem value="delivery" id="delivery" />
                        <Label
                          htmlFor="delivery"
                          className="flex-1 cursor-pointer"
                        >
                          <div className="font-semibold">
                            Livraison à domicile
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Frais de livraison: {formatPrice(10)}
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 border-2 rounded-xl p-4 hover:border-primary/50 hover:bg-accent/30 cursor-pointer transition-all">
                        <RadioGroupItem value="pickup" id="pickup" />
                        <Label
                          htmlFor="pickup"
                          className="flex-1 cursor-pointer"
                        >
                          <div className="font-semibold">
                            Retrait en magasin
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Gratuit - Prêt dans 20-30 min
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Delivery Address */}
                  {deliveryMethod === "delivery" && (
                    <div className="bg-card border rounded-xl p-6 shadow-sm">
                      <h2 className="text-xl font-semibold mb-5">
                        Adresse de livraison
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">Prénom *</Label>
                          <Input
                            id="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            required
                            className="h-11"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Nom *</Label>
                          <Input
                            id="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            required
                            className="h-11"
                          />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                          <Label htmlFor="address">Adresse *</Label>
                          <Input
                            id="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            required
                            className="h-11"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="city">Ville *</Label>
                          <Input
                            id="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            required
                            className="h-11"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="zipCode">Code postal *</Label>
                          <Input
                            id="zipCode"
                            value={formData.zipCode}
                            onChange={handleInputChange}
                            required
                            className="h-11"
                          />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                          <Label htmlFor="instructions">
                            Instructions de livraison (optionnel)
                          </Label>
                          <Textarea
                            id="instructions"
                            value={formData.instructions}
                            onChange={handleInputChange}
                            placeholder="Code, étage, informations supplémentaires..."
                            rows={3}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Contact Information */}
                  <div className="bg-card border rounded-xl p-6 shadow-sm">
                    <h2 className="text-xl font-semibold mb-5">
                      Informations de contact
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Téléphone *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          className="h-11"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Order Summary */}
                <div className="space-y-6">
                  {/* Order Items - Editable */}
                  <div className="bg-card border rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-5">
                      <h2 className="text-xl font-semibold">Votre commande</h2>
                      <span className="text-sm text-muted-foreground">
                        {items.length}{" "}
                        {items.length > 1 ? "articles" : "article"}
                      </span>
                    </div>

                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                      {items.map((item) => (
                        <div
                          key={item.menuItem.id}
                          className="group relative bg-muted/30 rounded-lg p-4 border border-transparent hover:border-primary/20 transition-all"
                        >
                          <div className="flex gap-4">
                            {/* Image */}
                            <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                              <Image
                                src={item.menuItem.image}
                                alt={item.menuItem.name}
                                fill
                                className="object-cover"
                              />
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-base mb-1 truncate">
                                {item.menuItem.name}
                              </h3>
                              <p className="text-sm text-muted-foreground mb-3">
                                {formatPrice(item.menuItem.price)} l&apos;unité
                              </p>

                              {/* Quantity Controls */}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 rounded-full"
                                    onClick={() =>
                                      handleQuantityChange(
                                        item.menuItem.id,
                                        item.quantity - 1
                                      )
                                    }
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <span className="w-8 text-center font-medium">
                                    {item.quantity}
                                  </span>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 rounded-full"
                                    onClick={() =>
                                      handleQuantityChange(
                                        item.menuItem.id,
                                        item.quantity + 1
                                      )
                                    }
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>

                                <div className="text-right">
                                  <div className="font-semibold">
                                    {formatPrice(
                                      item.menuItem.price * item.quantity
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Delete Button */}
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
                              onClick={() => handleRemoveItem(item.menuItem.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="bg-card border rounded-xl p-6 shadow-sm sticky top-24">
                    <h2 className="text-xl font-semibold mb-5">
                      Récapitulatif
                    </h2>

                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between text-base">
                        <span className="text-muted-foreground">
                          Sous-total
                        </span>
                        <span className="font-medium">
                          {formatPrice(cartTotal)}
                        </span>
                      </div>
                      {deliveryMethod === "delivery" && (
                        <div className="flex justify-between text-base">
                          <span className="text-muted-foreground">
                            Frais de livraison
                          </span>
                          <span className="font-medium">
                            {formatPrice(deliveryFee)}
                          </span>
                        </div>
                      )}
                      <Separator className="my-4" />
                      <div className="flex justify-between font-semibold text-xl">
                        <span>Total</span>
                        <span className="text-primary">
                          {formatPrice(totalWithDelivery)}
                        </span>
                      </div>
                    </div>

                    {/* Estimated Time */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-lg p-3 mb-6">
                      <Clock className="h-4 w-4 flex-shrink-0" />
                      <span>
                        {deliveryMethod === "delivery"
                          ? "Livraison estimée: 30-45 min"
                          : "Prêt dans: 20-30 min"}
                      </span>
                    </div>

                    <Button
                      type="submit"
                      className="w-full gap-2 h-12 text-base font-semibold"
                      size="lg"
                      disabled={isSubmitting}
                    >
                      <CreditCard className="h-5 w-5" />
                      {isSubmitting
                        ? "Traitement en cours..."
                        : `Payer ${formatPrice(totalWithDelivery)}`}
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
