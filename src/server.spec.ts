/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { expect } from "chai";
import supertest from "supertest";
import faker from "faker";

describe("server", () => {
  const fakeUserSchema = {
    email: faker.internet.email(),
    password: faker.internet.password(),
  };

  const fakeContactSchema = {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    phoneNumber: faker.phone.phoneNumber(),
    address: faker.address.streetAddress(true),
  };

  let token = "";

  it("should have a basic GET / endpoint", async function test() {
    const response = await supertest(this.server).get("/").expect(200);
    expect(response.body).to.have.property("message");
  });

  describe("user.controller", () => {
    it("should fail to login with fake user", async function test() {
      return supertest(this.server)
        .post("/user/login")
        .send({
          email: faker.internet.email(),
          password: faker.internet.password(),
        })
        .expect(400);
    });

    it("should create user", async function test() {
      const response = await supertest(this.server)
        .post("/user/register")
        .send(fakeUserSchema)
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body.email).to.be.equal(fakeUserSchema.email);
      expect(response.body.token).to.be.a("string");

      token = response.body.token;
    });

    it("should login with created user", async function test() {
      return supertest(this.server)
        .post("/user/login")
        .send(fakeUserSchema)
        .expect("Content-Type", /json/)
        .expect(200);
    });
  });

  describe("contact.controller", () => {
    it("should fail to access without auth token", async function test() {
      await supertest(this.server)
        .post("/contact/create")
        .send(fakeContactSchema)
        .expect(401);
    });

    it("should create contact", async function test() {
      const response = await supertest(this.server)
        .post("/contact/create")
        .set("Authorization", `Bearer ${token}`)
        .send(fakeContactSchema)
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body.firstName).to.be.equal(fakeContactSchema.firstName);
      expect(response.body.lastName).to.be.equal(fakeContactSchema.lastName);
      expect(response.body.address).to.be.equal(fakeContactSchema.address);
      expect(response.body.phoneNumber).to.be.equal(
        fakeContactSchema.phoneNumber
      );
      expect(response.body.id).to.be.a("string");
    });
  });
});
