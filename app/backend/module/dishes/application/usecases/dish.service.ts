import { IDishRepository } from "../../entities/interface/dish.repository";
import { CreateDishDto } from "../dtos/create-dish.dto";
import { UpdateDishDto } from "../dtos/update-dish.dto";

export class DishService {
  constructor(private dishRepository: IDishRepository) {}
  async create(dish: CreateDishDto, file?: File | null) {
    return this.dishRepository.create(dish, file);
  }
  async update(id: string, dish: UpdateDishDto, file?: File | null) {
    return this.dishRepository.update(id, dish, file);
  }
  async findOne(id: string) {
    return this.dishRepository.findOne(id);
  }
  async deleteOne(id: string) {
    return this.dishRepository.deleteOne(id);
  }
}
