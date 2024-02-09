require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");

const router = require("./routes");

const port = process.env.PORT || 5000;
const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use("/static", express.static(path.join(__dirname, "/files/")));
app.use(cors(corsOptions));
app.use(express.json());
app.use(router);

app.get("/", (req, res) => {
  res.send("Welcome to the PDF Uploader API");
});
try {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
} catch (error) {
  console.error(`Error starting the server: ${error.message}`);
}
