import axios from "axios";

const API_URL = "http://localhost:5000/api/users";

export const updateUserService = async (id: string, data: any, token: string) => {
  return await axios.put(`${API_URL}/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
