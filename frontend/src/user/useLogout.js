// useLogout.js
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function useLogout() {
  const navigate = useNavigate();

  return async function logout() {
    await axios.post(
      "http://localhost:3000/logout",
      {},
      {
        withCredentials: true,
      }
    );

    navigate("/login");
  };
}