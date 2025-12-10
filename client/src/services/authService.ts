import axios from "axios";

export const loginUserService = async (email: string, password: string) => {
  const { data } = await axios.post("http://localhost:5000/api/auth/login", {
    email,
    password,
  });

  return data;
};
