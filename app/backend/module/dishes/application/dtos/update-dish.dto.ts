export interface UpdateDishDto {
  name?: string;
  description?: string;
  price?: number;
  imageUrl?: string;
  preparationTime?: number; // in minutes
  categoryId?: string;
}