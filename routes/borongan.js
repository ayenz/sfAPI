const express = require("express");
const router = express.Router();

router.get("/", (req, res) => res.send("This is get method from borongan.js"));

module.exports = router;
