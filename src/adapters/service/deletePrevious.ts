import { NextFunction, Request, Response } from "express";
import { CustomRequest } from "../middlewares/authMiddleware";
import cloudinary from "./cloudinary";


export const uploadEmployeeProfile = async (req : Request, res : Response, next : NextFunction) => {
  try {
    const employeeId = (req as unknown as CustomRequest).user.id;
    await cloudinary.uploader.destroy(`employees/${employeeId}`, {invalidate : true});
    next();
  } catch (err) {
    console.error("Error deleting old image:", err);
    res.status(500).json({ message: "Failed to delete previous image." });
  }
};