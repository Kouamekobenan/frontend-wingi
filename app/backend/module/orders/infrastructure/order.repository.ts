import { api } from "@/app/backend/api/api";
import { CreateOrderDto } from "../application/dtos/create-order.dto";
import { Order } from "../domain/entities/order.entity";
import { IOrderRepository } from "../domain/interface/order.repository";
import { OrderStatus } from "../domain/enums/order-status.enum";

export class OrderRepository implements IOrderRepository {
  async create(dto: CreateOrderDto): Promise<Order> {
    const url = "orders";
    const orders = await api.post(url, dto);
    return orders.data.data;
  }
  async findAll(): Promise<Order[]> {
    const url = "orders";
    const orders = await api.get(url);
    return orders.data.data;
  }
  async findByUserId(userId: string): Promise<Order[]> {
    const url = `orders/user/${userId}`;
    const orders = await api.get(url);
    return orders.data.data;
  }
  async updateStatus(orderId: string, status: OrderStatus): Promise<Order> {
    const url = `orders/${orderId}/status`;
    const orders = await api.patch(url, { status });
    return orders.data.data;
  }
}
