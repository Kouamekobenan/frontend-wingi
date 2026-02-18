import { Dish } from "../../entities/dish.entity";
import { IDishRepository } from "../../entities/interface/dish.repository";

export class FindAllDishUseCase {
  constructor(private readonly dishRepository: IDishRepository) {}
  async execute(): Promise<Dish[]> {
    const dishes = await this.dishRepository.findAll();
    return dishes;
  }
}
