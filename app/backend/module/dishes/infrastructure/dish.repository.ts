import { api } from "@/app/backend/api/api";
import { Dish } from "../entities/dish.entity";
import { IDishRepository } from "../entities/interface/dish.repository";
import { CreateDishDto } from "../application/dtos/create-dish.dto";
import { UpdateDishDto } from "../application/dtos/update-dish.dto";

export class DishRepositorty implements IDishRepository {
  async findAll(): Promise<Dish[]> {
    const url = "dishes";
    const dishes = await api.get(url);
    return dishes.data.data;
  }
  async create(dish: CreateDishDto, file?: File | null): Promise<Dish> {
    const url = "dishes";
    let response;
    if (file) {
      const formData = new FormData();
      formData.append("imageUrl", file);
      formData.append("name", dish.name);
      formData.append("description", dish.description);
      formData.append("price", dish.price.toString());
      formData.append("preparationTime", dish.preparationTime.toString());
      formData.append("categoryId", dish.categoryId);
       response = await api.post(url, formData, {
         headers: { "Content-Type": "multipart/form-data" },
       }); // pas besoin de headers
    } else {
      response = await api.post(url, dish); // envoi JSON classique
    }
    return response.data.data;
  }
  async update(
    id: string,
    dish: UpdateDishDto,
    file?: File | null,
  ): Promise<Dish> {
    const url = `dishes/${id}`;
    let response;

    if (file) {
      const formData = new FormData();
      formData.append("imageUrl", file);
      formData.append("name", dish?.name ?? "");
      formData.append("description", dish?.description ?? "");
      formData.append("price", dish.price?.toString() ?? "0");
      formData.append(
        "preparationTime",
        dish.preparationTime?.toString() ?? "0",
      );
      formData.append("categoryId", dish?.categoryId ?? "");
      response = await api.patch(url, formData);
    } else {
      response = await api.patch(url, dish);
    }
    return response.data.data;
  }
  async findOne(id: string): Promise<Dish | null> {
    const url = `dishes/${id}`;
    const dish = await api.get(url);
    return dish.data.data;
  }
  async deleteOne(id: string): Promise<void> {
    const url = `dishes/${id}`;
    await api.delete(url);
  }
}
