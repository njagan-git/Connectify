import "./Navbar.css";
import { Link } from "react-router-dom";

function Navbar({ user, openSidebar }) {
  return (
    <nav className="navbar">

      <div className="logo">
        <h2>Connectify</h2>
      </div>

      <div className="search">
        <input
          type="text"
          placeholder="Search..."
        />
      </div>

      <div className="navbar-right">

        {user ? (
          // Logged-in user
          <div className="avatar">
            <img
              src={
                user.profilePic ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt="profile"
              onClick={openSidebar}
            />
          </div>
        ) : (
          // Not logged in
          <Link to="/login" className="login-btn">
            Login
          </Link>
        )}

      </div>

    </nav>
  );
}

export default Navbar;