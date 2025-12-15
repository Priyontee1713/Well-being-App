const mongoose = require("mongoose");

const journalSchema = new mongoose.Schema(
    {
        text: { type: String, required: true },
        font: { type: String, default: "Arial" },
        images: { type: [String], default: [] },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Journal", journalSchema);
