import { api } from "@/app/backend/api/api";
import {
  RegisterDto,
  RegisterResponse,
} from "../application/dtos/registere.dto";
import { User } from "../domain/entities/user.entity";
import { IUserRepository } from "../domain/interfaces/user-repository.interface";

export class UserRepository implements IUserRepository {
  async create(dto: RegisterDto): Promise<RegisterResponse> {
    const response = await api.post(`/auth/register`, dto);
    const { data } = response.data; 

    return {
      message: response.data.message,
      token: {
        access_token: data.access_token, 
      },
      user: data.user, 
    };
  }
  async updateRole(id: string): Promise<void> {
    const url = `users/role/${id}`;
    await api.patch(url);
  }
  async findAll(): Promise<User[]> {
    const url = "/users";
    const users = await api.get(url);
    return users.data.data;
  }
  async update(id: string, user: Partial<User>): Promise<User> {
    const url = `users/${id}`;
    const updatedUser = await api.patch(url, user);
    return updatedUser.data;
  }
}
