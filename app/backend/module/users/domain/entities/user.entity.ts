import { UserRole } from "../enums/role.enum";

export class User {
  constructor(
    public readonly id: string,
    public name: string,
    public email: string,
    public password: string,
    public firstName: string,
    public lastName: string,
    public phone: string,
    public address: string,
    public role: UserRole,
    public isActive: boolean,
    public createdAt: Date,
    public updatedAt: Date,
  ) {}
}
