import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'tsyringe';
import { HTTP_STATUS_CODES } from '../../shared/constants';
import { IRefreshTokenUseCase } from '../../entities/useCaseInterface/IRefreshTokenUseCase';

@injectable()
export class RefreshController {
  constructor(
    @inject('IRefreshTokenUseCase') private refreshTokenUseCase: IRefreshTokenUseCase,
  ) { }

  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const role = req.params.role;
      const refreshToken = req.cookies[role === "admin" ? "_refresh_token" : "refresh_token"];

      if (!refreshToken) {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ message: 'Unauthorized: No refresh token provided' });
        return;
      }

      const { accessToken } = await this.refreshTokenUseCase.execute(refreshToken, res, role);

      res.status(HTTP_STATUS_CODES.OK).json({ accessToken });
    } catch (error) {
      if (error instanceof Error && error.message === "Invalid or Expired Refresh Token") {
        console.log("error undd")
        res.status(HTTP_STATUS_CODES.FORBIDDEN).json({ message: "Forbidden: Invalid or expired refresh token" });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }
}