import { CreateOrderDto } from "../../application/dtos/create-order.dto";
import { Order } from "../entities/order.entity";
import { OrderStatus } from "../enums/order-status.enum";

export interface IOrderRepository {
  create(dto: CreateOrderDto): Promise<Order>;
  findAll(): Promise<Order[]>;
  findByUserId(userId: string): Promise<Order[]>;
  updateStatus(orderId: string, status: OrderStatus): Promise<Order>;
}
