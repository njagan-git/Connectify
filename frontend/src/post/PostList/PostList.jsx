import { useEffect, useState } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";
import "./PostList.css";
import CommentList from "./CommentList";
import CommentForm from "./CommentForm";
import {useLogout} from "../../user/useLogout"
import Navbar from "../../components/Navbar"
import Sidebar from "../../components/Sidebar/Sidebar"

function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user,setUser] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:3000/me", {
  withCredentials: true,
})
.then((res) => {
  setUser(res.data.user);
})
.catch((err) => {
  console.log("User not logged in", err);
});
    axios.get("http://localhost:3000/posts")
      .then(res => {
        setPosts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.log("Error in react", err);
        setLoading(false);
      });
  }, []);

     async function handleLike(id) {
    try {
        const res = await axios.patch(
            `http://localhost:3000/posts/${id}/like`,
            {},
            {
                withCredentials: true
            }
        );

        setPosts(posts.map(post =>
            post._id === id ? res.data : post
        ));

    } catch (err) {
        console.log(err);
    }
}
const handleLogout = useLogout()
function openSidebar() {
  
   setSidebarOpen(true);
}

function closeSidebar() {
    setSidebarOpen(false);
}
  
  return (
  
    <div className="feed">
     {/* <div className="feed-header">
       {user?<h1>Welcome back {user.username} :) <br /></h1>:''}
        <h1 className="feed-title">Posts</h1>
        {!user?<div> <Link to="/register" className="new-post-btn">
          Register
        </Link>
        <Link to="/login" className="new-post-btn">
          loginIn
        </Link>
        <Link to="/posts/new" className="new-post-btn">
          + Add Post
        </Link>
      </div>: <button onClick={handleLogout}>
    Logout
</button>}
    </div>*/}
    <Navbar
    user={user}
    openSidebar={openSidebar}
    />
    <Sidebar
    user={user}
    isOpen={sidebarOpen}
    closeSidebar={closeSidebar}
/>
      {loading && <p className="feed-status">Loading posts…</p>}
      {!loading && posts.length === 0 && (
        <p className="feed-status">No posts yet.</p>
      )}

      <div className="feed-grid">
        {posts.map((post) => {
        const liked =
          user &&
          post.likes.some(id => id.toString() === user._id);

        return (
          <div className="post-card" key={post._id}>
            <div className="post-image-wrap">
              <img
                src={post.images.url}
                alt={post.caption || "post image"}
                className="post-image"
              />
            </div>

            <div className="post-body">
              <p className="post-caption">{post.caption}</p>

              <button onClick={() => handleLike(post._id)}>
                {liked ? "❤️" : "🤍"} {post.likes.length}
              </button>

              <div className="post-tags">
                {post.hashtags.map((tag, i) => (
                  <span key={i} className="tag-chip">
                    #{tag}
                  </span>
                ))}
              </div>

              <CommentList comments={post.comments} />

              <CommentForm
                postId={post._id}
                onCommentAdded={(newComments) =>
                  updatePostComments(post._id, newComments)
                }
              />

              <p>Post by {post.author.username}</p>
            </div>
          </div>
        );
      })}
      </div>
    </div>
  );
}

export default PostList;