export interface IResetPasswordUseCase {
    resetPassword(token: string, newPassword: string): Promise<void>;
}