const cron = require("node-cron");
const { createBackupDirectory, backupData } = require("../utils/backup");

const backupJob = cron.schedule("10 0 * * *", async () => {
  console.log("Running backup job");
  await createBackupDirectory();
  await backupData();
});

module.exports = backupJob;
