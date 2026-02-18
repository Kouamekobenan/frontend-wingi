import { api } from "@/app/backend/api/api";
import { CreateCategoryDto } from "../application/dtos/create-category.dto";
import { Category } from "../domain/entities/category";
import { ICategoryRepository } from "../domain/interface/category.repository";
import { UpdateCategoryDto } from "../application/dtos/update-category.dto";

export class CategoryRepository implements ICategoryRepository {
  private readonly url = "categories";
  async create(dto: CreateCategoryDto): Promise<Category> {
    const createNewCat = await api.post(this.url, dto);
    return createNewCat.data;
  }
  async findAll(): Promise<Category[]> {
    const categoriesData = await api.get(this.url);
    return categoriesData.data.data;
  }
  async findById(id: string): Promise<Category> {
    const category = await api.get(`/categories/${id}`);
    return category.data.data;
  }
  async update(id: string, updateDto: UpdateCategoryDto): Promise<Category> {
    const catUpdated = await api.put(`/categories/${id}`, updateDto);
    return catUpdated.data;
  }
  async delete(id: string): Promise<void> {
    await api.delete(`/categories/${id}`);
  }
}
