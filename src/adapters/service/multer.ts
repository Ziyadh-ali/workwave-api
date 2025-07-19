import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../service/cloudinary";
import { CustomRequest } from "../middlewares/authMiddleware";
import { CustomError } from "../../shared/errors/CustomError";
import { HTTP_STATUS_CODES } from "../../shared/constants";

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        const employeeId = (req as CustomRequest).user.id

        if (!employeeId) {
            throw new CustomError("Employee _id is required to save image" , HTTP_STATUS_CODES.BAD_REQUEST);
        }
        return {
            folder: "user_profiles",
            public_id: `employees/${employeeId}`,
            format: file.mimetype.split("/")[1],
            transformation: [{ width: 500, height: 500, crop: "limit" }],
            overwrite: true,
        };
    },
});

const upload = multer({ storage });

export default upload;
