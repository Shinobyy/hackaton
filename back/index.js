require("dotenv").config();

const express = require("express");
const app = express();
const port = process.env.PORT;

const invoiceRoutes = require("./routes/invoiceRoutes");
const userRoutes = require("./routes/userRoutes");

app.use("/", invoiceRoutes);
app.use("/clients", userRoutes);

app.get("/api", (req, res) => {
  res.json("API");
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
