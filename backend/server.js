const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));  // for base64 images
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/journals", require("./routes/journalRoutes"));

app.get("/", (req, res) => {
    res.send("Journal API Running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
