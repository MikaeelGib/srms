import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

export const login = async (
  identifier: string,
  password: string,
  role: "admin" | "student"
) => {
  const res = await axios.post(`${API_URL}/login`, {
    identifier,
    password,
    role
  });

  localStorage.setItem("token", res.data.token);
  return res.data;
};