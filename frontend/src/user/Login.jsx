import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import "./Register.css"; // reusing the same auth styles
import axios from "axios";
function Login() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { username: "", password: "" }
  });

  async function submitAction(data) {
    setSubmitting(true);
    setServerError("");
    try {
      const res=await axios.post(
  "http://localhost:3000/login",
  data,
  {
    withCredentials: true,
  }

);
      console.log("Logged in:", res.data.user);
      navigate("/posts");
    } catch (err) {
      console.error("Login error:", err);
      setServerError(
        err.response?.data?.message || "Invalid username or password"
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-heading">Log in</h2>

        <form onSubmit={handleSubmit(submitAction)} className="auth-form">
          <div className="form-field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Your username"
              {...register("username", { required: "Username is required" })}
            />
            {errors.username && <p className="field-error">{errors.username.message}</p>}
          </div>

          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Your password"
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && <p className="field-error">{errors.password.message}</p>}
          </div>

          {serverError && <p className="field-error submit-error">{serverError}</p>}

          <button type="submit" className="submit-btn" disabled={submitting}>
            {submitting ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;