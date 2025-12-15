const Journal = require("../models/Journal");

// CREATE
exports.createJournal = async (req, res) => {
    try {
        const journal = await Journal.create(req.body);
        res.status(201).json(journal);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// READ ALL
exports.getJournals = async (req, res) => {
    try {
        const journals = await Journal.find().sort({ createdAt: -1 });
        res.status(200).json(journals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// UPDATE
exports.updateJournal = async (req, res) => {
    
    try {
        const { text, font, images } = req.body;

        const updated = await Journal.findByIdAndUpdate(
            req.params.id,
            { text, font, images },
            { new: true }
        );

        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE
exports.deleteJournal = async (req, res) => {
    try {
        await Journal.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
