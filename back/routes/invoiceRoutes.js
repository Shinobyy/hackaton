const express = require("express");
const invoiceController = require("../controllers/invoiceController");

const router = express.Router();

router.get("/", invoiceController.getUsers);
router.post("/add", invoiceController.createUser);
router.put("/update/:id", invoiceController.updateUser);
router.delete("/delete/:id", invoiceController.deleteUser);

module.exports = router;
