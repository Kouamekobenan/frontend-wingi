import { Dish } from "../dish.entity";

export interface IDishRepository {
  findAll(): Promise<Dish[]>;
}
