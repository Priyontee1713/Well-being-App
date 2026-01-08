import axios from "axios";

const API = "http://localhost:5000/api/music";

// Get all music
export const getAllMusic = async () => {
  const res = await axios.get(`${API}`);
  return res.data;
};

// Search music
export const searchMusic = async (query) => {
  const res = await axios.get(`${API}/search?query=${query}`);
  return res.data;
};

// Get music by category
export const getByCategory = async (category) => {
  const res = await axios.get(`${API}/category/${category}`);
  return res.data;
};
