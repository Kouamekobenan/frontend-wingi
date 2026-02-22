import { User } from "../../../users/domain/entities/user.entity";
import { OrderStatus } from "../enums/order-status.enum";

export class Order {
  constructor(
    public readonly id: string,
    public orderNumber: string,
    public userId: string,
    public status: OrderStatus,
    public totalAmount: number,
    public createdAt: Date,
    public updatedAt: Date,
    public notes?: string,
    public deliveryAddress?: string,
    public user?: User,
  ) {}
}
