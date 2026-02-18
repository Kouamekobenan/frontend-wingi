import { CreateCategoryDto } from "../../application/dtos/create-category.dto";
import { UpdateCategoryDto } from "../../application/dtos/update-category.dto";
import { Category } from "../entities/category";
export interface ICategoryRepository {
  create(dto: CreateCategoryDto): Promise<Category>;
  findAll(): Promise<Category[]>;
  findById(id: string): Promise<Category>;
  update(id: string, updateDto: UpdateCategoryDto): Promise<Category>;
  delete(id: string): Promise<void>;
}
