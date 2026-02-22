import { IOrderItemRepository } from "../../domain/interface/order-item.repository";
import { CreateOrderItemDto } from "../dtos/create-order-item.dto";

export class OrderItemsService {
  constructor(private readonly orderItemRepo: IOrderItemRepository) {}
  async create(dto: CreateOrderItemDto) {
    return await this.orderItemRepo.create(dto);
  }
  async findAll() {
    return await this.orderItemRepo.findAll();
  }
  async findById(id: string) {
    return await this.orderItemRepo.findById(id);
  }
}
