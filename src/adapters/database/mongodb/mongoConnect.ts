import mongoose, { mongo } from "mongoose";
import { config } from "../../../shared/config";


export class MongoConnect {
    private MongoUrl : string;

    constructor(){
        this.MongoUrl = config.URL;
    }

    async connect(){
        try {
            await mongoose.connect(this.MongoUrl);
            console.log("Data base connected");

            mongoose.connection.on("error",(error)=>{
                console.log("MongoDb connection erro : ",error);
            })
        } catch (error) {
            console.error("Failed to connect to MongoDB:", error);
            throw new Error("Database connection failed");
        }
    }
}