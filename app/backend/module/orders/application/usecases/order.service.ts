import { IOrderRepository } from "../../domain/interface/order.repository";
import { CreateOrderDto } from "../dtos/create-order.dto";
export class OrderService {
  constructor(private readonly orderRepository: IOrderRepository) {}
  async create(dto: CreateOrderDto) {
    return await this.orderRepository.create(dto);
  }
  async findAll() {
    return await this.orderRepository.findAll();
  }
  async findByUserId(userId: string) {
    return await this.orderRepository.findByUserId(userId);
  }
}
