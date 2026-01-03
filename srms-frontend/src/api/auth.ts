import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

export const login = async (email: string, password: string) => {
  const res = await axios.post(`${API_URL}/login`, {
    email,
    password,
  });

  // backend returns token
  localStorage.setItem("token", res.data.token);

  return res.data;
};
