"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  User as UserIcon,
  Phone,
  Mail,
  Home,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { OrderItemRepository } from "@/app/backend/module/orderItems/infrastructure/orderItem.repository";
import { OrderItemsService } from "@/app/backend/module/orderItems/application/usecases/order-items.usecase";
import { OrderRepository } from "@/app/backend/module/orders/infrastructure/order.repository";
import { OrderService } from "@/app/backend/module/orders/application/usecases/order.service";
import { OrderStatus } from "@/app/backend/module/orders/domain/enums/order-status.enum";
import { useAuth } from "@/app/context/AuthContext";

// ─── Config ───────────────────────────────────────────────────────────────────
const orderItemRepo = new OrderItemRepository();
const orderItemService = new OrderItemsService(orderItemRepo);
const orderRepo = new OrderRepository();
const orderService = new OrderService(orderRepo);

// ─── Component ────────────────────────────────────────────────────────────────
export default function CheckoutPage() {
  const { items, clearCart, updateQuantity, removeItem } = useCart();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState("delivery");
  const [instructions, setInstructions] = useState("");
  const { user } = useAuth();

  const cartTotal = calculateCartTotal(items);
  const deliveryFee = deliveryMethod === "delivery" ? 10.0 : 0;
  const totalWithDelivery = cartTotal + deliveryFee;

  // ─── Handlers ───────────────────────────────────────────────────────────────
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

  // ─── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!user?.id) throw new Error("Utilisateur non authentifié");

      const order = await orderService.create({
        orderNumber: `ORD-${Date.now()}`,
        userId: user.id,
        status: OrderStatus.PENDING,
        totalAmount: totalWithDelivery,
        deliveryAddress:
          deliveryMethod === "delivery" ? user.address : undefined,
      });

      await Promise.all(
        items.map((item) =>
          orderItemService.create({
            orderId: order.id,
            dishId: item.menuItem.id,
            quantity: item.quantity,
            price: item.menuItem.price,
          }),
        ),
      );

      toast({
        title: "Commande confirmée !",
        description: "Votre commande a été enregistrée avec succès.",
      });

      clearCart();
    } catch (error) {
      console.error("Erreur commande:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Empty Cart ──────────────────────────────────────────────────────────────
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
                <Link href="/menu">Voir le menu</Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const canSubmit =
    user && (!deliveryMethod || deliveryMethod === "pickup" || !!user.address);

  // ─── Render ──────────────────────────────────────────────────────────────────
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
                Vérifiez votre commande et choisissez votre mode de livraison
              </p>
            </div>

            <form onSubmit={handleSubmitOrder}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* ── Left Column ── */}
                <div className="space-y-6">
                  {/* ── Bloc infos user ── */}
                  {user ? (
                    <div className="bg-card border rounded-xl p-6 shadow-sm">
                      <div className="flex items-center justify-between mb-5">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                          <UserIcon className="h-5 w-5 text-primary" />
                          Vos informations
                        </h2>
                        <Link
                          href="/profile"
                          className="text-sm text-primary hover:underline underline-offset-4 transition-colors"
                        >
                          Modifier le profil
                        </Link>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <UserIcon className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Nom complet
                            </p>
                            <p className="text-sm font-medium">
                              {user.firstName} {user.lastName}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Mail className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Email
                            </p>
                            <p className="text-sm font-medium">{user.email}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Phone className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Téléphone
                            </p>
                            {user.phone ? (
                              <p className="text-sm font-medium">
                                {user.phone}
                              </p>
                            ) : (
                              <p className="text-sm text-amber-600 italic">
                                Non renseigné
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Home className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Adresse
                            </p>
                            {user.address ? (
                              <p className="text-sm font-medium">
                                {user.address}
                              </p>
                            ) : (
                              <p className="text-sm text-amber-600 italic">
                                Non renseignée
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Alerte adresse manquante */}
                      {!user.address && deliveryMethod === "delivery" && (
                        <div className="mt-4 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3">
                          <span className="text-amber-500 flex-shrink-0">
                            ⚠️
                          </span>
                          <p className="text-sm text-amber-700">
                            Aucune adresse enregistrée.{" "}
                            <Link
                              href="/profile"
                              className="font-semibold underline underline-offset-4"
                            >
                              Ajoutez-en une dans votre profil
                            </Link>{" "}
                            ou choisissez le retrait en magasin.
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* ── User non connecté ── */
                    <div className="bg-card border rounded-xl p-6 shadow-sm">
                      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                        <span className="text-amber-500 text-lg flex-shrink-0">
                          ℹ️
                        </span>
                        <div>
                          <p className="text-sm font-medium text-amber-800">
                            Connexion requise
                          </p>
                          <p className="text-sm text-amber-700 mt-0.5">
                            Connectez-vous pour finaliser votre commande. Votre
                            panier sera conservé.
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        className="w-full gap-2 h-11"
                        asChild
                      >
                        <Link href="/login?redirect=/checkout">
                          Se connecter pour continuer
                        </Link>
                      </Button>
                      <p className="text-center text-sm text-muted-foreground mt-3">
                        Pas encore de compte ?{" "}
                        <Link
                          href="/register?redirect=/checkout"
                          className="font-medium text-primary hover:underline underline-offset-4"
                        >
                          Créer un compte
                        </Link>
                      </p>
                    </div>
                  )}

                  {/* ── Mode de livraison ── */}
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
                            {formatPrice(10)} ·{" "}
                            {user?.address ?? "Adresse du profil"}
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
                            Gratuit · Prêt dans 20-30 min
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>

                    {/* Instructions optionnelles */}
                    {deliveryMethod === "delivery" && (
                      <div className="mt-4 space-y-2">
                        <Label htmlFor="instructions">
                          Instructions{" "}
                          <span className="text-muted-foreground font-normal">
                            (optionnel)
                          </span>
                        </Label>
                        <Textarea
                          id="instructions"
                          value={instructions}
                          onChange={(e) => setInstructions(e.target.value)}
                          placeholder="Code d'entrée, étage, informations supplémentaires..."
                          rows={3}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* ── Right Column ── */}
                <div className="space-y-6">
                  {/* Articles */}
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
                            <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                              <Image
                                src={item.menuItem.imageUrl}
                                alt={item.menuItem.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-base mb-1 truncate">
                                {item.menuItem.name}
                              </h3>
                              <p className="text-sm text-muted-foreground mb-3">
                                {formatPrice(item.menuItem.price)} l&apos;unité
                              </p>
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
                                        item.quantity - 1,
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
                                        item.quantity + 1,
                                      )
                                    }
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>
                                <div className="font-semibold">
                                  {formatPrice(
                                    item.menuItem.price * item.quantity,
                                  )}
                                </div>
                              </div>
                            </div>
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

                  {/* Récapitulatif */}
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

                    <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-lg p-3 mb-6">
                      <Clock className="h-4 w-4 flex-shrink-0" />
                      <span>
                        {deliveryMethod === "delivery"
                          ? "Livraison estimée: 30-45 min"
                          : "Prêt dans: 20-30 min"}
                      </span>
                    </div>

                    {/* ── Bouton conditionnel ── */}
                    {user ? (
                      <Button
                        type="submit"
                        className="w-full gap-2 h-12 text-base font-semibold"
                        size="lg"
                        disabled={isSubmitting || !canSubmit}
                      >
                        <CreditCard className="h-5 w-5" />
                        {isSubmitting
                          ? "Traitement en cours..."
                          : `Payer ${formatPrice(totalWithDelivery)}`}
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        className="w-full gap-2 h-12 text-base font-semibold"
                        size="lg"
                        asChild
                      >
                        <Link href="/login?redirect=/checkout">
                          Se connecter pour payer
                        </Link>
                      </Button>
                    )}

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
