export interface IForgotPasswordUseCase {
    confirmEmailAndSendLink(email : string) : Promise<void>;
}