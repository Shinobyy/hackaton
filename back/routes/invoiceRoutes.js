const express = require("express");
const invoiceController = require("../controllers/invoiceController");

const router = express.Router();

router.get("/", invoiceController.getUsers);
router.get("/add", invoiceController.createUser);
router.get("/update", invoiceController.updateUser);
router.get("/delete", invoiceController.deleteUser);

module.exports = router;
