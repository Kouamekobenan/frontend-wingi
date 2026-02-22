import { CreateDishDto } from "../../application/dtos/create-dish.dto";
import { UpdateDishDto } from "../../application/dtos/update-dish.dto";
import { Dish } from "../dish.entity";

export interface IDishRepository {
  findAll(): Promise<Dish[]>;
  create(dish: CreateDishDto, file?: File | null): Promise<Dish>;
  update(id:string,dish: UpdateDishDto, file?: File | null): Promise<Dish>;
  findOne(id: string): Promise<Dish | null>;
  deleteOne(id: string): Promise<void>;
}
