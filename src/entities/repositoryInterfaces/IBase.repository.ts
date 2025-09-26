// IBaseRepository.ts
export interface IBaseRepository<T> {
  create(data: Partial<T>): Promise<T>;
  findById(id: string): Promise<T | null>;
  findAll(
    filter?: Record<string, unknown>,
    options?: { skip?: number; limit?: number; sort?: Record<string, 1 | -1> }
  ): Promise<T[]>;
  update(id: string, data: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<void>;
  getAll(): Promise<T[] | []>
}
