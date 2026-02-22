import { OrderStatus } from "../../domain/enums/order-status.enum";

export interface CreateOrderDto {
  orderNumber: string;
  userId: string;
  status?: OrderStatus;
  totalAmount: number;
  notes?: string;
  deliveryAddress?: string;
}