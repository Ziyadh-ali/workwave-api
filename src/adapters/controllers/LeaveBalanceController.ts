import { inject , injectable } from "tsyringe";
import { Request , Response } from "express";
import { HTTP_STATUS_CODES, MESSAGES } from "../../shared/constants";
import { ILeaveBalanceUseCase } from "../../entities/useCaseInterface/ILeaveBalanceUseCase";

@injectable()
export class LeaveBalanceController {
    constructor(
        @inject("ILeaveBalanceUseCase") private leaveBalanceUseCase : ILeaveBalanceUseCase,
    ) {}

    async getLeaveBalanceById (req : Request , res : Response) : Promise<void> {
        const {employeeId} = req.params;
        try {
            if(!employeeId){
                res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                    success : false,
                    message : MESSAGES.ERROR.USER.NO_USER_ID
                });
            }
            const leaveBalances = await this.leaveBalanceUseCase.getLeaveBalanceByEmployeeId(employeeId);

            res.status(HTTP_STATUS_CODES.OK).json({
                success : true , 
                leaveBalances,
            })
        } catch (error) {
            console.log(error);
            res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                success : false,
                message : MESSAGES.ERROR.GENERIC
            });
        }
    }
}