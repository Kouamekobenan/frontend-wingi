import { Dish } from "../../../dishes/entities/dish.entity";

export class OrderItem {
  constructor(
    public readonly id: string,
    public orderId: string,
    public dishId: string,
    public quantity: number,
    public price: number,
    public notes?: string,
    public dish?: Dish,
  ) {}
}
