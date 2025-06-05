import { Response } from "express";


export interface IRefreshTokenUseCase {
    execute(refreshToken : string , res : Response , role : string) : Promise<{accessToken : string}>;
}