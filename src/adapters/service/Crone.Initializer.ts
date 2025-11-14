import cron from "node-cron";
import { container } from "tsyringe";
import { CronService } from "../../adapters/service/CronService";

export function initializeCronJobs() {
    const cronService = container.resolve(CronService);

    cron.schedule("50 23 * * *", () => {
        cronService.markAbsentees();
    });

    console.log("Cron Jobs initialized...");
}
