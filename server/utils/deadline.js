import checkUpcomingDeadlines from "./alert";
import cron from "node-cron";

// check for upcoming deadlines every day at 1 hour
cron.schedule("0 * * * *", checkUpcomingDeadlines);
