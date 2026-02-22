import { CreateOrderDto } from "../../application/dtos/create-order.dto";
import { Order } from "../entities/order.entity";

export interface IOrderRepository {
  create(dto: CreateOrderDto): Promise<Order>;
  findAll(): Promise<Order[]>;
  findByUserId(userId: string): Promise<Order[]>;
}
