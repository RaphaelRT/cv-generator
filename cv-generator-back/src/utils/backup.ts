import { exec } from "child_process";
import fs from "fs";

const BACKUP_DIR = "./backups";
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR);
}

export function backupDatabase() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupFile = `${BACKUP_DIR}/db_backup_${timestamp}.sql`;

  exec(
    `docker exec my_postgres pg_dump -U myuser offers-follow > ${backupFile}`,
    (error) => {
      if (error) {
        console.error("Backup failed:", error);
      } else {
        console.log(`Backup saved to ${backupFile}`);
      }
    }
  );
}
