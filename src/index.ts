import "reflect-metadata";
import "./shared/events";  // OK
import { config } from "./shared/config";
import { Server } from "./Presentation/http/server";
import { MongoConnect } from "./adapters/database/mongodb/mongoConnect";
import { initializeCronJobs } from "./adapters/service/Crone.Initializer";

const server = new Server(config.PORT);
const connectMongo = new MongoConnect();

async function startApp() {
    await connectMongo.connect();
    server.start();

    initializeCronJobs(); 

}

startApp();