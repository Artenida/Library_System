import axios from "axios";

export const loginUserService = async (email: string, password: string) => {
  const { data } = await axios.post("http://localhost:5000/api/auth/login", {
    email,
    password,
  });

  return data;
};

export const registerUserService = async (username: string, email: string, password: string) => {
  const { data } = await axios.post("http://localhost:5000/api/auth/register", {
    username,
    email,
    password,
  });
  return data; 
};