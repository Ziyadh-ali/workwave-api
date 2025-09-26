// BaseRepository.ts
import { Model, Document } from "mongoose";
import { IBaseRepository } from "../../entities/repositoryInterfaces/IBase.repository";

export abstract class BaseRepository<T extends Document>
  implements IBaseRepository<T>
{
  protected constructor(protected readonly model: Model<T>) {}

  async create(data: Partial<T>): Promise<T> {
    return await this.model.create(data);
  }

  async findById(id: string): Promise<T | null> {
    return await this.model.findById(id).exec();
  }

  async getAll(): Promise<T[] | []> {
    return await this.model.find().sort({createdAt : -1});
  }

  async findAll(
    filter: Record<string, unknown> = {},
    options: { skip?: number; limit?: number; sort?: Record<string, 1 | -1> } = {}
  ): Promise<T[]> {
    return await this.model
      .find(filter)
      .skip(options.skip || 0)
      .limit(options.limit || 0)
      .sort(options.sort || {})
      .exec();
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    return await this.model.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async delete(id: string): Promise<void> {
    await this.model.findByIdAndDelete(id).exec();
  }
}
