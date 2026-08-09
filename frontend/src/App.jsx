import { Routes, Route } from "react-router-dom";

import PostList from "./post/PostList/PostList";
import CreatePost from "./post/CreatePost/CreatePost";

import Register from "./user/Register";
import Login from "./user/Login";

import Profile from "./components/Sidebar/Profile";
import MyPosts from "./components/Sidebar/MyPosts";
import LikedPosts from "./components/Sidebar/LikedPosts";
import CommentedPosts from "./components/Sidebar/CommentedPosts";
import Settings from "./components/Sidebar/Settings";

import Followers from "./components/Followers";
import Following from "./components/Following";


function App() {
    return (
        <Routes>

            {/* Posts */}
            <Route
                path="/posts"
                element={<PostList />}
            />

            <Route
                path="/posts/new"
                element={<CreatePost />}
            />


            {/* Authentication */}
            <Route
                path="/register"
                element={<Register />}
            />

            <Route
                path="/login"
                element={<Login />}
            />


            {/* Profile */}
            <Route
                path="/profile"
                element={<Profile />}
            />
            <Route
                path="/profile/:userId"
                element={<Profile />}
            />


            {/* Followers */}
            <Route
                path="/profile/:userId/followers"
                element={<Followers />}
            />


            {/* Following */}
            <Route
                path="/profile/:userId/following"
                element={<Following />}
            />


            {/* Sidebar pages */}
            <Route
                path="/myposts"
                element={<MyPosts />}
            />

            <Route
                path="/likedposts"
                element={<LikedPosts />}
            />

            <Route
                path="/mycomments"
                element={<CommentedPosts />}
            />

            <Route
                path="/settings"
                element={<Settings />}
            />

        </Routes>
    );
}

export default App;