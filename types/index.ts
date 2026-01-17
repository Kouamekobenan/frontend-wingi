import { StaticImageData } from "next/image";

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
 image: string | StaticImageData;
  category: string;
  popular?: boolean;
  vegetarian?: boolean;
  spicy?: boolean;
};

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

export type CartItem = {
  menuItem: MenuItem;
  quantity: number;
  specialInstructions?: string;
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


