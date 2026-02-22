import { User } from "../../domain/entities/user.entity";
import { IUserRepository } from "../../domain/interfaces/user-repository.interface";

export class UpdateUserUseCase {
  constructor(private userRepository: IUserRepository) {}
  async execute(id: string, user: Partial<User>): Promise<User> {
    return await this.userRepository.update(id, user);
  }
}
