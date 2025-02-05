import { exec } from "child_process";
import fs from "fs";

const BACKUP_DIR = "./backups";

export function restoreDatabase() {
  const backups = fs.readdirSync(BACKUP_DIR).sort().reverse();
  if (backups.length === 0) {
    console.log("No backup found!");
    return;
  }

  const latestBackup = `${BACKUP_DIR}/${backups[0]}`;
  console.log(`Restoring database from ${latestBackup}...`);

  exec(
    `docker exec -i my_postgres psql -U myuser offers-follow < ${latestBackup}`,
    (error) => {
      if (error) {
        console.error("Restore failed:", error);
      } else {
        console.log("Restore complete!");
      }
    }
  );
}
