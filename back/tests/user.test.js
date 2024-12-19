const express = require("express");
const request = require("supertest");
const userRoutes = require("../routes/userRoutes");
const userController = require("../controllers/userController");

const app = express();
app.use(express.json());
app.use("/", userRoutes);

jest.mock("../controllers/userController");

describe("Test user Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call userController.getUsers on GET /", async () => {
    userController.getUsers.mockImplementation((req, res) => {
      res.status(200).json({ message: "Users fetched" });
    });

    const response = await request(app).get("/");

    expect(response.status).toBe(200);
    expect(userController.getUsers).toHaveBeenCalled();
  });

  it("should call userController.createUser on POST /add", async () => {
    userController.createUser.mockImplementation((req, res) => {
      res.status(201).json({ message: "User created" });
    });

    const response = await request(app)
      .post("/add")
      .send({ name: "Test User", email: "test@example.com" });

    expect(response.status).toBe(201);
    expect(userController.createUser).toHaveBeenCalled();
  });

  it("should call userController.updateUser on PUT /update/:id", async () => {
    userController.updateUser.mockImplementation((req, res) => {
      res.status(200).json({ message: "User updated" });
    });

    const response = await request(app)
      .put("/update/1")
      .send({ name: "Updated User" });

    expect(response.status).toBe(200);
    expect(userController.updateUser).toHaveBeenCalled();
  });

  it("should call userController.deleteUser on DELETE /delete/:id", async () => {
    userController.deleteUser.mockImplementation((req, res) => {
      res.status(200).json({ message: "User deleted" });
    });

    const response = await request(app).delete("/delete/1");

    expect(response.status).toBe(200);
    expect(userController.deleteUser).toHaveBeenCalled();
  });
});
