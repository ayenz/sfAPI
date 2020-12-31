const express = require("express");
const mongoose = require("mongoose");
require("dotenv/config");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//CONNECT TO MONGODB
mongoose.connect(
    process.env.DB_CONNECTION,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log("Connected to mongodb")
);

//IMPORT ROUTES
const pegawaiRoutes = require("./routes/pegawai");
const boronganRoutes = require("./routes/borongan");
app.use("/api/pegawai", pegawaiRoutes);
app.use("/api/borongan", boronganRoutes);

app.get("/", (req, res) => {
    res.send("We are on HOme, Hello world bethc!");
});

const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Server running at port ${PORT}`));
