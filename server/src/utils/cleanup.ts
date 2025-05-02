import { schedule } from "node-cron";
import filesService from "../services/mediaService";
import fs from "fs";
import path from "path";

const ROOT_DIR = process.env.USER_FILES;
if (ROOT_DIR === undefined) {
  throw new Error("USER_FILES environment variable is not set");
}

export default function cleanup() {
  schedule("0 0 * * *", async () => {
    const files = fs.readdirSync(ROOT_DIR!);
    for (const file of files) {
      const fileFromDB = await filesService.getMediaForCleanup(file);

      if (fileFromDB === null) {
        const filePath = path.join(ROOT_DIR!, fileFromDB!.mediaID);
        try {
          fs.rmSync(filePath);
        } catch (err) {
          console.error(`Failed to delete file ${filePath}:`, err);
        }
      }
    }
  });
}
