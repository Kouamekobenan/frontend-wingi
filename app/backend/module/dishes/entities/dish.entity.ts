export class Dish {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public price: number,
    public imageUrl: string,
    public isAvailable: boolean = true,
    public preparationTime: number,
    public categoryId: string,
    public createdAt: Date,
    public updatedAt: Date,
  ) {}
}
