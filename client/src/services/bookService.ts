import axios from "axios";
import type { CreateBookBody, IBook } from "../types/bookTypes";

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

export const getUserBooks = async (
  user_id: string,
  token: string
): Promise<IBook[]> => {
  const response = await axios.get(`${API_URL}/user/${user_id}/books`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.data;
};

export const createBookService = async (
  book: CreateBookBody,
  token: string
): Promise<IBook> => {
  const response = await axios.post(`${API_URL}/admin`, book, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.data;
};


export const updateBookService = async (
  book: IBook,
  token: string
): Promise<IBook> => {
  const response = await axios.put(`${API_URL}/${book.book_id}`, book, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.data;
};

export const deleteBookService = async (
  book_id: string,
  token: string
): Promise<{message: string}> => {
  const response = await axios.delete(`${API_URL}/admin/${book_id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const borrowBookService = async (
  book_id: string,
  data: { from_date: string; to_date?: string },
  token: string
): Promise<IBook> => {
  const response = await axios.post(`${API_URL}/${book_id}/borrow`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.data;
};

export const searchBooksByGenre = async (genre: string, token: string) => {
  const response = await axios.get(`${API_URL}/filter/filter?genre=${genre}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
