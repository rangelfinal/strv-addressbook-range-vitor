/* eslint-disable @typescript-eslint/require-await */
import { Migration } from "@mikro-orm/migrations";

export class Migration20210917172200 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "user" ("email" varchar(255) not null, "hashed_password" varchar(255) not null);'
    );
    this.addSql(
      'alter table "user" add constraint "user_pkey" primary key ("email");'
    );
  }
}
