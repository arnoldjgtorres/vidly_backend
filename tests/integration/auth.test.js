const request = require("supertest");
const { User } = require("../../models/user");

let server;

describe("auth middleware", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    await server.close();
  });

  let token;
  const exec = async () => {
    return request(server)
      .post("/api/genres")
      .set("x-auth-token", token)
      .send({ name: "genre1" });
  };

  beforeEach(() => {
    token = new User().generateAuthToken();
  });

  it("should return a 400 if token is invalid ", async () => {
    token = "a";
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 200 if token valid ", async () => {
    const res = await exec();
    expect(res.status).toBe(200);
  });
});
