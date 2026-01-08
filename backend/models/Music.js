import mongoose from "mongoose";

const musicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  artist: {
    type: String,
    default: "Unknown",
  },
  category: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true, // audio link
  },
  coverImage: {
    type: String,
    default: "",
  },
}, { timestamps: true });

export default mongoose.model("Music", musicSchema);
