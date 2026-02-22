import { api } from "@/app/backend/api/api";
import { CreateOrderItemDto } from "../application/dtos/create-order-item.dto";
import { OrderItem } from "../domain/entities/orderItem.entity";
import { IOrderItemRepository } from "../domain/interface/order-item.repository";

export class OrderItemRepository implements IOrderItemRepository {
  async create(dto: CreateOrderItemDto): Promise<OrderItem> {
    const orderItems = await api.post("/order-items", dto);
    return orderItems.data.data;
  }
  async findAll(): Promise<OrderItem[]> {
    const orderItems = await api.get("/order-items");
    return orderItems.data.data;
  }
  async findById(id: string): Promise<OrderItem[]> {
    const orderItem = await api.get(`/order-items/order/${id}`);
    return orderItem.data.data;
  }
}
