import cron from "node-cron";
import { checkDeadlines } from "../config/checkDeadlines.js";

cron.schedule("0 9 * * * ", async () => {
  //9am
  await checkDeadlines();
});
