import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class User {
  @PrimaryKey()
  email: string;

  @Property()
  hashedPassword: string;

  constructor(email: string, hashedPassword: string) {
    this.email = email;
    this.hashedPassword = hashedPassword;
  }
}
