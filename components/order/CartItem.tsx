"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatPrice } from "@/lib/utils";
import { Minus, Plus, Trash2 } from "lucide-react";
import { CartItem as CartItemType } from "@/types";
import { useCart } from "@/lib/cart";
import { useState } from "react";

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem, updateInstructions } = useCart();
  const [instructions, setInstructions] = useState(item.specialInstructions || "");
  
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      updateQuantity(item.menuItem.id, newQuantity);
    }
  };
  
  const handleRemove = () => {
    removeItem(item.menuItem.id);
  };
  
  const handleInstructionsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInstructions(e.target.value);
    updateInstructions(item.menuItem.id, e.target.value);
  };
  
  const itemTotal = item.menuItem.price * item.quantity;
  
  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="grid sm:grid-cols-[100px_1fr] gap-4">
          <div className="relative aspect-square rounded-md overflow-hidden">
            <Image
              src={item.menuItem.image}
              alt={item.menuItem.name}
              fill
              className="object-cover"
              sizes="100px"
            />
          </div>
          
          <div>
            <div className="flex flex-wrap justify-between items-start mb-2">
              <h3 className="font-medium">{item.menuItem.name}</h3>
              <span className="font-medium">{formatPrice(itemTotal)}</span>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4">{item.menuItem.description}</p>
            
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div className="flex items-center">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={() => handleQuantityChange(item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                
                <Input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                  className="h-8 w-12 mx-2 text-center"
                  min="1"
                />
                
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={() => handleQuantityChange(item.quantity + 1)}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10 p-0"
                onClick={handleRemove}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                <span>Supprimer</span>
              </Button>
            </div>
            
            <div className="mt-4">
              <Textarea
                placeholder="Instructions spéciales (allergies, préférences...)"
                value={instructions}
                onChange={handleInstructionsChange}
                className="text-sm resize-none"
                rows={2}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}