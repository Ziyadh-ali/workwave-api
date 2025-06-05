import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../service/cloudinary";

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req , file) => ({
        folder: "user_profiles",
        format: file.mimetype.split("/")[1],
        transformation: [{ width: 500, height: 500, crop: "limit" }],
    }),
});

const upload = multer({ storage });

export default upload;
