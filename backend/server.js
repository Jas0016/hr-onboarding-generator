const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const documentRoutes = require("./routes/documentRoutes");
const Template = require("./models/Template");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/documents", documentRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected");

    // Seed templates if empty
    const count = await Template.countDocuments();
    if (count === 0) {
      await Template.insertMany([
        {
          name: "Company Policies",
          content:
            "Our company follows strict professional conduct, data security, and compliance standards.",
        },
        {
          name: "Employee Benefits",
          content:
            "Employees receive health insurance, paid leaves, and performance-based incentives.",
        },
        {
          name: "Team Introduction",
          content:
            "You will collaborate with cross-functional teams and report to your assigned manager.",
        },
      ]);
      console.log("Templates seeded");
    }
  })
  .catch((err) => console.error(err));

app.listen(5000, () => console.log("Server started"));
