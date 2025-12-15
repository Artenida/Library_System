import axios from "axios";

const API_URL = "http://localhost:5000/api/genres";

// Get all genres
export const getGenresService = async (token: string) => {
  return await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Create genre
export const createGenreService = async (
  data: { name: string },
  token: string
) => {
  return await axios.post(API_URL, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Update genre
export const updateGenreService = async (
  id: string,
  data: { name: string },
  token: string
) => {
  return await axios.put(`${API_URL}/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Delete genre
export const deleteGenreService = async (id: string, token: string) => {
  return await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// 📚 Get books by genre
export const getGenreBooksService = async (id: string, token: string) => {
  return await axios.get(`${API_URL}/${id}/books`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
