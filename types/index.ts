import { StaticImageData } from "next/image";

// types/index.ts
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string | StaticImageData;
  categoryId: string;
  isAvailable: boolean;
  preparationTime: number;
  c?: string;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  selectedSide?: {
    id: string;
    name: string;
    additionalPrice: number;
  };
  specialInstructions?: string;
}

export type Category = {
  id: string;
  name: string;
  description: string;
  image: string | StaticImageData;
};

export type Side = {
  id: string;
  name: string;
  additionalPrice: number;
};


export type CateringService = {
  id: string;
  name: string;
  description: string;
  minGuests: number;
  maxGuests: number;
 pricePerPerson: number;
  image: string;
};

export type Reservation = {
  name: string;
  email: string;
  phone: string;
  date: Date;
  time: string;
  guests: number;
  serviceType: string;
  message?: string;
};


