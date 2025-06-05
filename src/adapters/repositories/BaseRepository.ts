import { Model, Document } from "mongoose";

export class BaseRepository<T> {
    protected model: Model<T>;

    constructor(model: Model<T>) {
        this.model = model;
    }

    async create(data: Partial<T>): Promise<T> {
        return await this.model.create(data);
    }

    async findById(id: string): Promise<T | null> {
        return await this.model.findById(id);
    }

    async update(id: string, updates: Partial<T>): Promise<T | null> {
        return await this.model.findByIdAndUpdate(id, updates, { new: true });
    }

    async delete(id: string): Promise<void> {
        await this.model.findByIdAndDelete(id);
    }

    async findAll(): Promise<T[]> {
        return await this.model.find();
    }
}
