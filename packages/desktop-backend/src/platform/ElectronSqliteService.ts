import pathUtil from "node:path";
import fs from "node:fs";
import { app } from "electron";

import { PlatformSqliteService } from "@postero/core";

class ExpoSqliteService implements PlatformSqliteService {
  public async getKnexConfig() {
    const userDataPath = pathUtil.join(app.getPath("userData"), "postero");

    await fs.promises.mkdir(userDataPath, { recursive: true, mode: 0o700 });

    const dbPath = pathUtil.join(userDataPath, "store.db");
    console.log(`db path = "${dbPath}"`);

    // DB file created by sqlite3 has to permissive mode.
    // We create the db file to set the file mode.
    try {
      await fs.promises.stat(dbPath);
    } catch (err) {
      if (err.code === "ENOENT") {
        const fd = await fs.promises.open(dbPath, "w", 0o600);
        await fd.close();
      } else {
        throw err;
      }
    }

    return {
      client: "better-sqlite3",
      connection: {
        filename: dbPath,
      },
    };
  }
}

export default ExpoSqliteService;
