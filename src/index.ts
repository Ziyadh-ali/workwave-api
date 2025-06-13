import "reflect-metadata";
import "./shared/events";
import { config  } from "./shared/config";
import { Server } from "./frameworks/http/server";
import { MongoConnect } from "./frameworks/database/mongodb/mongoConnect";


const server = new Server(config.PORT);
const connectMongo = new MongoConnect();


connectMongo.connect();
server.start();
console.log("Server is running from:", __dirname);
