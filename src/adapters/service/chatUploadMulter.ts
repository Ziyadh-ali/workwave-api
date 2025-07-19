import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../service/cloudinary";
import { CustomError } from "../../shared/errors/CustomError";
import { HTTP_STATUS_CODES } from "../../shared/constants";

const chatMediaStorage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        try {
            let resourceType = "auto";
            let format = file.mimetype.split("/")[1];

            if (file.mimetype.startsWith("image/")) {
                resourceType = "image";
            } else if (file.mimetype.startsWith("video/")) {
                resourceType = "video";
            }else if (file.mimetype === "application/pdf") {
                resourceType = "raw"; 
            }

            return {
                folder: "chat_media",
                resource_type: resourceType,
                format: format,
                transformation:
                    resourceType !== "raw"
                 ? [
                    { width: 800, height: 800, crop: "limit", quality: "auto" },
                    { quality: "auto", fetch_format: "auto" }
                ]: undefined
            };
        } catch (err) {
            console.error("CloudinaryStorage error:", err);
            throw err;
        }
    }
});

export const chatMediaUpload = multer({
    storage: chatMediaStorage,
    limits: { fileSize: 15 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/gif",
            "video/mp4",
            "video/quicktime",
            "application/pdf"
        ];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new CustomError("Invalid file type. Only images, videos, and PDFs are allowed." , HTTP_STATUS_CODES.BAD_REQUEST));
        }
    }
});