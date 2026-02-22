export interface CreateOrderItemDto {
  orderId: string;
  dishId: string;
  quantity: number;
  price: number;
  notes?: string;
}