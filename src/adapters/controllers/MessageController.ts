import { Request, Response } from "express";
import { HTTP_STATUS_CODES } from "../../shared/constants";
import { inject, injectable } from "tsyringe";
import { IMessageUseCase } from "../../entities/useCaseInterface/IMessageUseCase";
import { CustomError } from "../../shared/errors/CustomError";

@injectable()
export class MessageController {
    constructor(
        @inject("IMessageUseCase") private messageUseCase: IMessageUseCase,
    ) { }

    async getPrivateMessages(Req: Request, res: Response): Promise<void> {
            const { user1, user2 } = Req.query;
            if (user1 && user2) {
                const messages = await this.messageUseCase.getPrivateMessages(user1.toString(), user2.toString());
                res.status(HTTP_STATUS_CODES.OK).json({
                    messages
                })
            }
    }
    async getGroupMessages(Req: Request, res: Response): Promise<void> {
            const { roomId } = Req.params;
            if (roomId) {
                const messages = await this.messageUseCase.getGroupMessages(roomId.toString());
                res.status(HTTP_STATUS_CODES.OK).json({
                    messages
                })
            }
    }

    async uploadMedia(req: Request, res: Response): Promise<void> {
            if (!req.file) {
                throw new CustomError("No file provided" , HTTP_STATUS_CODES.BAD_REQUEST);
            }

            const cloudinaryResult = req.file as any;
            let mediaType: 'image' | 'video' | 'document' = 'document';

            if (cloudinaryResult.mimetype.startsWith('image/')) {
                mediaType = 'image';
            } else if (cloudinaryResult.mimetype.startsWith('video/')) {
                mediaType = 'video';
            } else if (cloudinaryResult.mimetype === 'application/pdf') {
                mediaType = 'document';
            }

            console.log(cloudinaryResult)

            res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                media: {
                    url: cloudinaryResult.path,
                    type: mediaType,
                    public_id: cloudinaryResult.filename
                }
            });

    }

    // async deleteMedia(req: Request, res: Response): Promise<void> {
    //     try {
    //         const { public_id } = req.params;
    //         await this.mediaUseCase.deleteMedia(public_id);

    //         res.status(HTTP_STATUS_CODES.OK).json({
    //             success: true,
    //             message: "Media deleted successfully"
    //         });
    //     } catch (error) {
    //         res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
    //             success: false,
    //             message: error instanceof Error ? error.message : "Media deletion failed"
    //         });
    //     }
    // }
}