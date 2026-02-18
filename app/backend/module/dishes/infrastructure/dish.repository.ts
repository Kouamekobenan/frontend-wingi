import { api } from "@/app/backend/api/api";
import { Dish } from "../entities/dish.entity";
import { IDishRepository } from "../entities/interface/dish.repository";

export class DishRepositorty implements IDishRepository {
  async findAll(): Promise<Dish[]> {
    const url = "dishes";
    const dishes = await api.get(url);
    return dishes.data.data;
  }
}
