const express = require("express");
const router = express.Router();
const {
    createJournal,
    getJournals,
    updateJournal,
    deleteJournal
} = require("../controllers/journalController");

// /api/journals
router.post("/", createJournal);
router.get("/", getJournals);
router.put("/:id", updateJournal);
router.delete("/:id", deleteJournal);

module.exports = router;
