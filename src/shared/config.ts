import dotenv from "dotenv";

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

export const config = {
    PORT: process.env.PORT ? Number(process.env.PORT) : 5000,
    URL: process.env.MONGO_URI || "",
    NODE_ENV : process.env.NODE_ENV || "develpment",

    jwt: {
        ACCESS_SECRET_KEY: process.env.ACCESS_SECRET_KEY || "your-secret-key",
        REFRESH_SECRET_KEY: process.env.REFRESH_SECRET_KEY || "your-refresh-key",
        ACCESS_EXPIRES_IN: process.env.ACCESS_EXPIRES_IN || "",
        REFRESH_EXPIRES_IN: process.env.REFRESH_EXPIRES_IN || "",
        RESET_PASSWORD_SECRET_KEY : process.env.RESET_PASSWORD_SECRET_KEY || "",
        RESET_TOKEN_EXPIRES_IN : process.env.RESET_TOKEN_EXPIRES_IN || "", 
    },

    cors : {
        ALLOWED_ORIGIN: isProduction
      ? process.env.ALLOWED_ORIGIN_PROD || "https://workwave.ziyadhali.tech"
      : process.env.ALLOWED_ORIGIN_DEV || "http://localhost:5173",
    },

    cloudinary : {
        CLOUD_NAME : process.env.CLOUD_NAME,
        CLOUDINARY_API_KEY : process.env.CLOUDINARY_API_KEY,
        CLOUDINARY_API_SECRET : process.env.CLOUDINARY_API_SECRET
    },

    email : {
        EMAIL_USER : process.env.EMAIL_USER,
        EMAIL_PASS : process.env.EMAIL_PASS,
    },

    calander : {
        CALENDARIFIC_URL : process.env.CALENDARIFIC_URL,
        CALENDARIFIC_API_KEY : process.env.CALENDARIFIC_API_KEY,
    }

}