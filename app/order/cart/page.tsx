"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartItem from "@/components/order/CartItem";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/lib/cart";
import { calculateCartTotal, formatPrice } from "@/lib/utils";
import { ShoppingBag, ArrowLeft, ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function CartPage() {
  const { items, clearCart } = useCart();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const cartTotal = calculateCartTotal(items);
  const deliveryFee = 4.90;
  const totalWithDelivery = cartTotal + deliveryFee;
  
  const handleCheckout = async () => {
    setIsSubmitting(true);
    
    // Simulate API call for processing order
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Commande confirmée",
      description: "Votre commande a été traitée avec succès. Vous allez recevoir un email de confirmation.",
    });
    
    clearCart();
    setIsSubmitting(false);
    
    // This would typically redirect to a confirmation page
  };
  
  if (items.length === 0) {
    return (
      <>
        <Header />
        <main className="pt-24 pb-20">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
                  <ShoppingCart className="h-10 w-10 text-muted-foreground" />
                </div>
              </div>
              <h1 className="text-2xl font-serif font-semibold mb-2">Votre panier est vide</h1>
              <p className="text-muted-foreground mb-6">
                Vous n'avez pas encore ajouté d'articles à votre panier.
              </p>
              <Button asChild size="lg">
                <Link href="/order">
                  Parcourir le menu
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
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-serif font-semibold mb-2">Votre panier</h1>
            <p className="text-muted-foreground mb-6">
              Vérifiez vos articles et procédez au paiement
            </p>
            
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
              {/* Cart Items */}
              <div>
                <div className="space-y-4">
                  {items.map((item) => (
                    <CartItem key={item.menuItem.id} item={item} />
                  ))}
                </div>
                
                <div className="mt-6">
                  <Button variant="outline" asChild className="gap-2">
                    <Link href="/order">
                      <ArrowLeft className="h-4 w-4" />
                      Ajouter des plats
                    </Link>
                  </Button>
                </div>
              </div>
              
              {/* Order Summary */}
              <div>
                <div className="bg-card border rounded-lg p-6">
                  <h2 className="text-lg font-medium mb-4">Récapitulatif</h2>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sous-total</span>
                      <span>{formatPrice(cartTotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Livraison</span>
                      <span>{formatPrice(deliveryFee)}</span>
                    </div>
                    <Separator className="my-3" />
                    <div className="flex justify-between font-medium text-lg">
                      <span>Total</span>
                      <span>{formatPrice(totalWithDelivery)}</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full gap-2" 
                    size="lg"
                    onClick={handleCheckout}
                    disabled={isSubmitting}
                  >
                    <ShoppingBag className="h-5 w-5" />
                    {isSubmitting ? "Traitement en cours..." : "Finaliser la commande"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}