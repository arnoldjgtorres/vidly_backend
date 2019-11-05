const request = require("supertest");
const { Genre } = require("../../models/genre");
const { User } = require("../../models/user");
const mongoose = require("mongoose");
let server;

describe("/api/genres", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    await server.close();
    await Genre.deleteMany({});
  });

  describe("GET /", () => {
    it("should return all genres", async () => {
      const genres = [{ name: "genre1" }, { name: "genre2" }];

      await Genre.collection.insertMany(genres);
      const res = await request(server).get("/api/genres");
      console.log(res.body);
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some(g => g.name === "genre1")).toBeTruthy();
      expect(res.body.some(g => g.name === "genre2")).toBeTruthy();
    });
  });

  describe("GET /:id", () => {
    it("should return genre if valid id passed", async () => {
      const genre = new Genre({ name: "genre3" });
      await genre.save();

      const res = await request(server).get("/api/genres/" + genre._id);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", genre.name);
    });

    it("should return 404 with invalid id passed", async () => {
      const res = await request(server).get("/api/genres/" + "1");
      expect(res.status).toBe(404);
    });
  });

  describe("DELETE / ", async () => {
    let token;
    let id;
    let genre;

    const exec = async () => {
      return (res = await request(server)
        .delete("/api/genres" + id)
        .set("x-auth-token", token)
        .send());
    };

    beforeEach(async ()=>{
      genre = new Genre({name: 'genre1'})
      await genre.save()

      id = genre._id;
      token = new User({isAdmin: true}).generateAuthToken();
    })

    it("should return 401 if client is not logged in", async () => {
      token = ''
      const res = await exec();
      expect(res.status).toBe(401);

    });

    it("should return 403 if user is not an admin", async () => {
      token = new User({isAdmin: false}).generateAuthToken;
      const res = await exec();
      expect(res.status).toBe(403);
    });


    it("should return 404 if id is invalid ", async () => {
       id = 1;
      const res = await exec();     
      expect(res.status).toBe(404);
    });

    it("should return 404 if id is invalid ", async () => {
      id = mongoose.Types.ObjectId();
      const res = await exec();     
      expect(res.status).toBe(404);
    });

    it("should delete genre if found", () => {
      await exec();
      const genreInDB = await Genre.findById(id);
      expect(genreInDB).toBeNull();
    });

    it("should return deleted genre info", () => {
     const res = await exec();
     expect(res.body).toHaveProperty('_id', genre._id.toHexString());
     expect(res.body).toHaveProperty('name', genre.name)
    });

  });

  describe("POST /", () => {
    let token;
    let name;

    const exec = async () => {
      return (res = await request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name: name }));
    };

    beforeEach(() => {
      token = new User().generateAuthToken();
      name = "genre1";
    });

    it("should return 401 if client not logged in", async () => {
      token = "";

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return 400 w invalid genre length of 5 char", async () => {
      name = "1234";
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 404 w invalid genre more than 50 char", async () => {
      name = new Array(52).join("a");
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should save genre if it is valid id", async () => {
      await exec();

      const genre = await Genre.find({ name: "genre1" });

      expect(genre).not.toBeNull();
    });

    it("should return genre if it is valid id", async () => {
      const res = await exec();

      const genre = await Genre.find({ name: "genre1" });

      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "genre1");
    });
  });
});
