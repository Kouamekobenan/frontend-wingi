import { ICategoryRepository } from "../../domain/interface/category.repository";
import { CreateCategoryDto } from "../dtos/create-category.dto";
import { UpdateCategoryDto } from "../dtos/update-category.dto";
export class CategorieService {
  constructor(private readonly catRepository: ICategoryRepository) {}
  async create(dto: CreateCategoryDto) {
    return await this.catRepository.create(dto);
  }
  async findAll() {
    return await this.catRepository.findAll();
  }
  async findOne(id: string) {
    return await this.catRepository.findById(id);
  }
  async deleteOne(id: string) {
    return await this.catRepository.delete(id);
  }
  async update(id: string, dto: UpdateCategoryDto) {
    return await this.catRepository.update(id, dto);
  }
}
