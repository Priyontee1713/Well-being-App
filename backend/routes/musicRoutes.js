import express from "express";
import Music from "../models/Music.js";

const router = express.Router();

// Get all music
router.get("/", async (req, res) => {
  try {
    const songs = await Music.find();
    res.json(songs);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Search music by keyword (frontend uses ?query=xxx)
router.get("/search", async (req, res) => {
  try {
    const keyword = req.query.query || "";

    const results = await Music.find({
      title: { $regex: keyword, $options: "i" }
    });

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get by category
router.get("/category/:type", async (req, res) => {
  try {
    const type = req.params.type;

    const musics = await Music.find({ category: type });

    res.json(musics);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Add new music
router.post("/add", async (req, res) => {
  try {
    const newSong = await Music.create(req.body);
    res.json(newSong);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
