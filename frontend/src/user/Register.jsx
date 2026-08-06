import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Register.css";

function Register() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      bio: "",
      profilePic: "",
      status: "public"
    }
  });

  async function submitAction(data) {
    setSubmitting(true);
    setServerError("");
    try {
      await axios.post("http://localhost:3000/register", data);
      navigate("/posts");
    } catch (err) {
      console.error("Registration error:", err);
      setServerError(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-heading">Create your account</h2>

        <form onSubmit={handleSubmit(submitAction)} className="auth-form">
          <div className="form-field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Choose a username"
              {...register("username", {
                required: "Username is required",
                minLength: { value: 3, message: "At least 3 characters" }
              })}
            />
            {errors.username && <p className="field-error">{errors.username.message}</p>}
          </div>

          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email"
                }
              })}
            />
            {errors.email && <p className="field-error">{errors.email.message}</p>}
          </div>

          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="At least 6 characters"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "At least 6 characters" }
              })}
            />
            {errors.password && <p className="field-error">{errors.password.message}</p>}
          </div>

          <div className="form-field">
            <label htmlFor="bio">Bio (optional)</label>
            <textarea
              id="bio"
              rows={2}
              placeholder="Tell us a bit about yourself"
              {...register("bio")}
            />
          </div>

          <div className="form-field">
            <label htmlFor="profilePic">Profile picture URL (optional)</label>
            <input
              id="profilePic"
              type="text"
              placeholder="https://..."
              {...register("profilePic")}
            />
          </div>

          <div className="form-field">
            <label htmlFor="status">Account visibility</label>
            <select id="status" {...register("status")}>
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>

          {serverError && <p className="field-error submit-error">{serverError}</p>}

          <button type="submit" className="submit-btn" disabled={submitting}>
            {submitting ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;