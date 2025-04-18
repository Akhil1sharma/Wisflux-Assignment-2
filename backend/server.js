const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const connectDb = require("./config/connectionDb");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler"); // Import error handler

const PORT = process.env.PORT || 3000;
connectDb();

app.use(express.json());
app.use(cors());
app.use(express.static("public"));

app.use("/user", require("./routes/user"));
app.use("/recipe", require("./routes/recipe"));

// Use the error handler after all routes
app.use(errorHandler);

app.listen(PORT, (err) => {
  if (err) {
    console.log("Server failed to start", err);
    process.exit(1); // Ensure exit if the server fails
  } else {
    console.log(`App is listening on port ${PORT}`);
  }
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
