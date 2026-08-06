import "./Sidebar.css";
import { useLogout } from "../../user/useLogout";
import { useNavigate } from "react-router-dom";

function Sidebar({ user, isOpen, closeSidebar }) {
  const handleLogout = useLogout()
   const navigate = useNavigate();
  return (
    <>
      {/* Dark overlay */}
      
      <div
        className={`overlay ${isOpen ? "show" : ""}`}
        onClick={closeSidebar}
      >
      
      </div>

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
  <div className="sidebar-top">

    <h2 className="menu">Menu</h2>

    <button
        className="close-btn"
        onClick={closeSidebar}
    >
        ✖
    </button>

</div>
        <div className="sidebar-header">

          <img
            src={
              user?.profilePic ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt="profile"
          />

          <h2 className="username">{user?.username}</h2>

          <p>{user?.email}</p>

        </div>

        <hr />
        <button
        className="sidebar-btn"
        onClick={() => {
           closeSidebar();
          navigate("/profile")}}
    >
        👤 Profile
    </button>

    <button
        className="sidebar-btn"
        onClick={() =>{
           closeSidebar();
           navigate("/myposts")}}
    >
        📝 My Posts
    </button>

    <button
        className="sidebar-btn"
        onClick={() =>{
           closeSidebar();
          navigate("/likedposts")}}
    >
        ❤️ Liked Posts
    </button>

    <button
        className="sidebar-btn"
        onClick={() =>{
           closeSidebar();
           navigate("/mycomments")}}
    >
        💬 My Comments
    </button>

    <button
        className="sidebar-btn"
        onClick={() =>{
           closeSidebar();
           navigate("/settings")}}
    >
        ⚙️ Settings
    </button>

        <button className="logout-btn" onClick={handleLogout}>
          🚪 Logout
        </button>

      </div>
    </>
  );
}

export default Sidebar;