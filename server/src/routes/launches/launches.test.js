import request from "supertest";
import app from "../../app.js";
import connectDB, { disconnectDB } from "../../services/mongo.js";
import { loadPlanetsData } from "../../models/planets.model.js";

describe("Testing Launches API", () => {
  beforeAll(async () => {
    await connectDB();
    await loadPlanetsData();
  });

  afterAll(async () => {
    await disconnectDB();
  });

  // GET api test - /api/launches/getAllLaunches

  describe("test - GET /api/launches/getAllLaunches", () => {
    test("It should respond with 200 success", async () => {
      const res = await request(app)
        .get("/api/launches/getAllLaunches")
        .expect("Content-Type", /json/)
        .expect(200);
    });
  });

  // POST api test - /api/launches/addNewLaunch

  describe("test - POST /api/launches/addNewLaunch", () => {
    const testData = {
      mission: "Test123",
      rocket: "Test123",
      launchDate: "27 December, 2027",
      target: "Kepler-442 b",
    };

    const testDataWithInvalidDate = {
      mission: "Test123",
      rocket: "Test123",
      launchDate: "test7",
      target: "Kepler-442 b",
    };

    const testDataWithoutDate = {
      mission: "Test123",
      rocket: "Test123",
      target: "Kepler-442 b",
    };

    const testDataWithoutTarget = {
      mission: "Test123",
      rocket: "Test123",
    };

    test("IT should create a new launch and send back 201 created", async () => {
      const res = await request(app)
        .post("/api/launches/addNewLaunch")
        .send(testData)
        .expect("Content-Type", /json/)
        .expect(201);

      const reqDate = new Date(testData.launchDate).valueOf();
      const resDate = new Date(res.body.launchDate).valueOf();

      expect(resDate).toBe(reqDate);
      expect(res.body).toMatchObject(testDataWithoutDate);
    });

    test("It should catch missing required feild porperties", async () => {
      const res = await request(app)
        .post("/api/launches/addNewLaunch")
        .send(testDataWithoutTarget)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(res.body).toStrictEqual({
        succes: false,
        error: "Missing required properties",
      });
    });

    test("It should catch invalid dates", async () => {
      const res = await request(app)
        .post("/api/launches/addNewLaunch")
        .send(testDataWithInvalidDate)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(res.body).toStrictEqual({
        succes: false,
        error: "Invalid Launch Date",
      });
    });
  });
});
