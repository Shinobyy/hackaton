const express = require("express");
const invoiceController = require("../controllers/invoiceController");

const router = express.Router();

router.get("/", invoiceController.getInvoices);
router.post("/add", invoiceController.createInvoice);
router.put("/update/:id", invoiceController.updateInvoice);
router.delete("/delete/:id", invoiceController.deleteInvoice);

module.exports = router;
