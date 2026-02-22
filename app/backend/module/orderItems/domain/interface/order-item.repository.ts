import { CreateOrderItemDto } from "../../application/dtos/create-order-item.dto";
import { OrderItem } from "../entities/orderItem.entity";

export interface IOrderItemRepository {
  create(dto: CreateOrderItemDto): Promise<OrderItem>;
  findAll(): Promise<OrderItem[]>;
  findById(id: string): Promise<OrderItem[]>;
}
