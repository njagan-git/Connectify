import "./Navbar.css";

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

      <div className="avatar">
        <img
          src={
            user?.profilePic ||
            "https://cdn-icons-png.flaticon.com/512/149/149071.png"
          }
          alt="profile"
          onClick={openSidebar}
        />
      </div>

    </nav>
  );
}

export default Navbar;