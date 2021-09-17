/* eslint-disable import/first */
process.env.FIRESTORE_EMULATOR_HOST = "localhost:8080";
process.env.GCLOUD_PROJECT = "strv-addressbook-rangel-vitor";
process.env.JWT = "strv-addressbook-rangel-vitor";

import compose from "docker-compose";
import { Server } from "http";
import path from "path";
import { serve } from "./server";

export const mochaHooks = {
  server: undefined as Server | undefined,
  async beforeAll(): Promise<void> {
    await compose.upAll({ cwd: path.join(__dirname), log: true });
    this.server = await serve(undefined);
  },
  async afterAll(): Promise<void> {
    await compose.stop();
    this.server?.close();
  },
};
