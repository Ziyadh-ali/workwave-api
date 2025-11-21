
import { AdminResponseDTO } from '../dtos/ResponseDTOs/AdminDTO';
import { Admin } from './../models/adminEntities/AdminEnitity';

export class AdminMapper {
    static ResponseMapper(data: Admin): AdminResponseDTO {
        return {
            _id: data._id.toString(),
            name: data.name,
            email: data.email,
            role: data.role,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt
        }
    }
}