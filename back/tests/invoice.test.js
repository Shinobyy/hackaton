const express = require("express");
const request = require("supertest");
const invoiceRoutes = require("../routes/invoiceRoutes");
const invoiceController = require("../controllers/invoiceController");

// Créez l'application en dehors du describe
const app = express();
app.use(express.json()); // Middleware pour parser JSON
app.use("/", invoiceRoutes);

// Mocquez les méthodes du contrôleur
jest.mock("../controllers/invoiceController");

describe("Test Invoice Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call invoiceController.getUsers on GET /", async () => {
    invoiceController.getUsers.mockImplementation((req, res) => {
      res.status(200).json({ message: "Users fetched" });
    });

    const response = await request(app).get("/");

    expect(response.status).toBe(200);
    expect(invoiceController.getUsers).toHaveBeenCalled();
  });

  it("should call invoiceController.createUser on POST /add", async () => {
    invoiceController.createUser.mockImplementation((req, res) => {
      res.status(201).json({ message: "User created" });
    });

    const response = await request(app)
      .post("/add")
      .send({ name: "Test User", email: "test@example.com" });

    expect(response.status).toBe(201);
    expect(invoiceController.createUser).toHaveBeenCalled();
  });

  it("should call invoiceController.updateUser on PUT /update/:id", async () => {
    invoiceController.updateUser.mockImplementation((req, res) => {
      res.status(200).json({ message: "User updated" });
    });

    const response = await request(app)
      .put("/update/1")
      .send({ name: "Updated User" });

    expect(response.status).toBe(200);
    expect(invoiceController.updateUser).toHaveBeenCalled();
  });

  it("should call invoiceController.deleteUser on DELETE /delete/:id", async () => {
    invoiceController.deleteUser.mockImplementation((req, res) => {
      res.status(200).json({ message: "User deleted" });
    });

    const response = await request(app).delete("/delete/1");

    expect(response.status).toBe(200);
    expect(invoiceController.deleteUser).toHaveBeenCalled();
  });
});
