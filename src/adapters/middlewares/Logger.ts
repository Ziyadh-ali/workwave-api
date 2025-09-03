import fs from "fs";
import path from "path";
import morgan from "morgan";
import { Request, Response, NextFunction } from "express";
const logDir = path.join(process.cwd(), "logs");

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const accessLogStream = fs.createWriteStream(
  path.join(logDir, "access.log"),
  { flags: "a" }
);

const errorLogStream = fs.createWriteStream(
  path.join(logDir, "error.log"),
  { flags: "a" }
);

export const requestLogger = morgan("combined", { stream: accessLogStream });

export const errorLogger = (err: any, req: Request, res: Response, next: NextFunction) => {
  const errorMessage = `[${new Date().toISOString()}] ${req.method} ${
    req.url
  } - ${err.message}\n${err.stack}\n\n`;
  errorLogStream.write(errorMessage);
  res.status(500).json({ error: "Internal Server Error" });
};
