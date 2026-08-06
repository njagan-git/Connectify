import { Routes, Route } from "react-router-dom";

import PostList from "./post/PostList/PostList";
import CreatePost from "./post/CreatePost/CreatePost";
import Register from "./user/Register"
import Login from "./user/Login";
import Profile from "./components/Sidebar/Profile"
import MyPosts from "./components/Sidebar/MyPosts"
import LikedPosts from "./components/Sidebar/LikedPosts"
import CommentedPosts from "./components/Sidebar/CommentedPosts"
import Settings from "./components/Sidebar/Settings"





function App() {
  return (
    <Routes>
      <Route path="/posts" element={<PostList />} />
      <Route path="/posts/new" element={<CreatePost />} />
      <Route path='/register' element ={<Register/>}/>
      <Route path='/login' element ={<Login/>}/>
      <Route path="/profile" element={<Profile />} />
      <Route path="/myposts" element={<MyPosts />} />
      <Route path="/likedposts" element={<LikedPosts />} />
      <Route path="/mycomments" element={<CommentedPosts />} />
      <Route path="/settings" element={<Settings />} />

    </Routes>
  );
}

export default App;