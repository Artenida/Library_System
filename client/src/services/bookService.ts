import axios from "axios";
import type { IBook } from "../types/bookTypes";

const API_URL = "http://localhost:5000/api/books";

export const getBooks = async (token: string, page = 1, limit = 10): Promise<IBook[]> => {
  const response = await axios.get(`${API_URL}?page=${page}&limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.data;
};
