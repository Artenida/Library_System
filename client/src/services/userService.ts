import axios from "axios";

const API_URL = "http://localhost:5000/api/users";

export const getUsersService = async (token: string) => {
  return await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const createUserService = (
  data: {
    username: string;
    email: string;
    role: string;
    password: string;
  },
  token: string
) => {
  return axios.post(`http://localhost:5000/api/auth/register`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateUserService = async (
  id: string,
  data: any,
  token: string
) => {
  return await axios.put(`${API_URL}/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteUserService = async (id: string, token: string) => {
  return await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
