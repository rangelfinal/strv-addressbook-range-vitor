import { Options } from "@mikro-orm/core";
import { User } from "./user/user.entity";

const config: Options = {
  type: "postgresql",
  dbName: "strv-addressbook",
  user: "fake-username",
  password: "fake-password",
  // as we are using class references here, we don't need to specify `entitiesTs` option
  entities: [User],
  debug: true,
  migrations: {
    path: "src/migrations",
    safe: true,
  },
};

export default config;
