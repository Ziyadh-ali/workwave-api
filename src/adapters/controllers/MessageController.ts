import { Request, Response } from "express";
import { HTTP_STATUS_CODES } from "../../shared/constants";
import { inject, injectable } from "tsyringe";
import { IMessageUseCase } from "../../entities/useCaseInterface/IMessageUseCase";

@injectable()
export class MessageController {
    constructor(
        @inject("IMessageUseCase") private messageUseCase: IMessageUseCase,
    ) { }

    async getPrivateMessages(Req: Request, res: Response): Promise<void> {
        try {
            const { user1, user2 } = Req.query;
            if (user1 && user2) {
                const messages = await this.messageUseCase.getPrivateMessages(user1.toString(), user2.toString());
                res.status(HTTP_STATUS_CODES.OK).json({
                    messages
                })
            }
        } catch (error) {
            console.log(error);
            res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                message: (error instanceof Error) ? error.message : "",
            });
        }
    }
    async getGroupMessages(Req: Request, res: Response): Promise<void> {
        try {
            const { roomId } = Req.params;
            if (roomId) {
                const messages = await this.messageUseCase.getGroupMessages(roomId.toString());
                res.status(HTTP_STATUS_CODES.OK).json({
                    messages
                })
            }
        } catch (error) {
            console.log(error);
            res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                message: (error instanceof Error) ? error.message : "",
            });
        }
    }

    async uploadMedia(req: Request, res: Response): Promise<void> {
        try {
            if (!req.file) {
                throw new Error("No file provided");
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

        } catch (error) {
            console.error("Media upload error:", error);
            res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                success: false,
                message: error instanceof Error ? error.message : "Media upload failed"
            });
        }
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