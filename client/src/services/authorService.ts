import axios from "axios";

const API_URL = "http://localhost:5000/api/authors";

// Get all authors
export const getAuthorsService = async (token: string) => {
  return await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Create author
export const createAuthorService = async (
  data: { name: string; birth_year: number },
  token: string
) => {
  return await axios.post(API_URL, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Update author
export const updateAuthorService = async (
  id: string,
  data: { name: string; birth_year: number },
  token: string
) => {
  return await axios.put(`${API_URL}/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Delete author
export const deleteAuthorService = async (id: string, token: string) => {
  return await axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Get books by author
export const getAuthorBooksService = async (id: string, token: string) => {
  return await axios.get(`${API_URL}/${id}/books`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
