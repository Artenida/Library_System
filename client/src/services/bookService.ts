import axios from "axios";
import type { IBook } from "../types/bookTypes";

const API_URL = "http://localhost:5000/api/books";

export const getBooks = async (
  token: string,
  page = 1,
  limit = 10
): Promise<IBook[]> => {
  const response = await axios.get(`${API_URL}?page=${page}&limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.data;
};

export const getSingleBook = async (
  id: string,
  token?: string
): Promise<any> => {
  const response = await axios.get(`http://localhost:5000/api/books/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  return response.data;
};

export const getUserBooks = async (token: string): Promise<IBook[]> => {
  const response = await axios.get(`${API_URL}/user/books`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.data;
};

export const updateBookService = async (book: IBook, token: string): Promise<IBook> => {
  const response = await axios.put(`${API_URL}/${book.book_id}`, book, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.data;
};