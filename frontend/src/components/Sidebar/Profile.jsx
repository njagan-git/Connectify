import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./Profile.css";

function Profile() {
  const { userId } = useParams();
  const navigate = useNavigate();

  // Logged-in user
  const [user, setUser] = useState(null);

  // Profile being viewed
  const [profile, setProfile] = useState(null);

  // Profile posts
  const [posts, setPosts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);
  const [error, setError] = useState("");

  const [followLoading, setFollowLoading] = useState(false);

  // =========================================================
  // LOAD LOGGED-IN USER + PROFILE
  // =========================================================

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        setError("");

        // 1. Get currently logged-in user
        const meResponse = await axios.get(
          "http://localhost:3000/me",
          {
            withCredentials: true
          }
        );

        const currentUser = meResponse.data.user;

        if (!currentUser) {
          setError("Please login first");
          setLoading(false);
          return;
        }

        setUser(currentUser);

        // 2. Decide which profile to load
        //
        // /profile
        //      -> own profile
        //
        // /profile/123
        //      -> profile of user 123

        const profileId = userId || currentUser._id;

        // 3. Get profile
        const profileResponse = await axios.get(
          `http://localhost:3000/users/${profileId}`,
          {
            withCredentials: true
          }
        );

        setProfile(profileResponse.data);

      } catch (err) {
        console.error("Profile loading error:", err);

        setError(
          err.response?.data?.message ||
          "Unable to load profile"
        );
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [userId]);

  // =========================================================
  // LOAD PROFILE POSTS
  // =========================================================

  useEffect(() => {
    async function loadPosts() {
      if (!profile) return;

      try {
        setPostsLoading(true);

        const response = await axios.get(
          `http://localhost:3000/users/${profile._id}/posts`
        );

        setPosts(response.data);

      } catch (err) {
        console.error("Posts loading error:", err);
      } finally {
        setPostsLoading(false);
      }
    }

    loadPosts();
  }, [profile]);

  // =========================================================
  // FOLLOW
  // =========================================================

  async function handleFollow() {
    if (!profile) return;

    try {
      setFollowLoading(true);

      const response = await axios.post(
        `http://localhost:3000/users/${profile._id}/follow`,
        {},
        {
          withCredentials: true
        }
      );

      // Backend returns updated target user
      setProfile(response.data);

      // Update current user's following list too
      setUser(prev => {
        if (!prev) return prev;

        return {
          ...prev,
          following: [
            ...(prev.following || []),
            profile._id
          ]
        };
      });

    } catch (err) {
      console.error("Follow error:", err);

      alert(
        err.response?.data?.message ||
        "Unable to follow user"
      );
    } finally {
      setFollowLoading(false);
    }
  }

  // =========================================================
  // UNFOLLOW
  // =========================================================

  async function handleUnfollow() {
    if (!profile) return;

    try {
      setFollowLoading(true);

      const response = await axios.delete(
        `http://localhost:3000/users/${profile._id}/follow`,
        {
          withCredentials: true
        }
      );

      // Backend returns updated target user
      setProfile(response.data);

      // Remove target user from current user's following
      setUser(prev => {
        if (!prev) return prev;

        return {
          ...prev,
          following: (prev.following || []).filter(
            id => {
              const idValue =
                typeof id === "object"
                  ? id._id
                  : id;

              return (
                idValue.toString() !==
                profile._id.toString()
              );
            }
          )
        };
      });

    } catch (err) {
      console.error("Unfollow error:", err);

      alert(
        err.response?.data?.message ||
        "Unable to unfollow user"
      );
    } finally {
      setFollowLoading(false);
    }
  }

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="profile-page">
        <p className="profile-status">
          Loading profile...
        </p>
      </div>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error) {
    return (
      <div className="profile-page">
        <p className="profile-error">
          {error}
        </p>

        <button
          className="back-button"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
      </div>
    );
  }

  // =========================================================
  // PROFILE NOT FOUND
  // =========================================================

  if (!profile) {
    return (
      <div className="profile-page">
        <p className="profile-status">
          Profile not found.
        </p>
      </div>
    );
  }

  // =========================================================
  // CHECK OWN PROFILE
  // =========================================================

  const isOwnProfile =
    user &&
    user._id.toString() ===
      profile._id.toString();

  // =========================================================
  // CHECK FOLLOWING
  // =========================================================

  const isFollowing =
    user &&
    profile.followers?.some(follower => {

      // Populated follower
      if (
        typeof follower === "object" &&
        follower !== null
      ) {
        return (
          follower._id.toString() ===
          user._id.toString()
        );
      }

      // ObjectId
      return (
        follower.toString() ===
        user._id.toString()
      );
    });

  // =========================================================
  // RETURN UI
  // =========================================================

  return (
    <div className="profile-page">

      {/* BACK BUTTON */}

      <button
        className="back-button"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>


      {/* =====================================================
          PROFILE HEADER
      ===================================================== */}

      <div className="profile-header">

        {/* PROFILE IMAGE */}

        <div className="profile-picture-container">

          <img
            src={
              profile.profilePic ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt={`${profile.username}'s profile`}
            className="profile-picture"
          />

        </div>


        {/* PROFILE INFORMATION */}

        <div className="profile-info">

          {/* USERNAME */}

          <h1 className="profile-username">
            {profile.username}
          </h1>


          {/* BIO */}

          {profile.bio && (
            <p className="profile-bio">
              {profile.bio}
            </p>
          )}


          {/* =================================================
              FOLLOWERS / FOLLOWING
          ================================================= */}

          <div className="profile-stats">

            {/* FOLLOWERS */}

            <div
              className="profile-stat"
              onClick={() =>
                navigate(
                  `/profile/${profile._id}/followers`
                )
              }
            >

              <strong>
                {profile.followers?.length || 0}
              </strong>

              <span>
                Followers
              </span>

            </div>


            {/* FOLLOWING */}

            <div
              className="profile-stat"
              onClick={() =>
                navigate(
                  `/profile/${profile._id}/following`
                )
              }
            >

              <strong>
                {profile.following?.length || 0}
              </strong>

              <span>
                Following
              </span>

            </div>

          </div>


          {/* =================================================
              PROFILE BUTTON
          ================================================= */}

          <div className="profile-actions">

            {isOwnProfile ? (

              // OWN PROFILE
              <button
                className="edit-profile-button"
                onClick={() =>
                  navigate("/edit-profile")
                }
              >
                Edit Profile
              </button>

            ) : (

              // OTHER USER PROFILE

              <button
                className={
                  isFollowing
                    ? "following-button"
                    : "follow-button"
                }
                onClick={
                  isFollowing
                    ? handleUnfollow
                    : handleFollow
                }
                disabled={followLoading}
              >

                {followLoading
                  ? "Loading..."
                  : isFollowing
                    ? "Following"
                    : "Follow"}

              </button>

            )}

          </div>

        </div>

      </div>


      {/* =====================================================
          POSTS
      ===================================================== */}

      <div className="profile-posts">

        <h2>
          Posts
        </h2>

        <div className="profile-posts-line"></div>


        {/* POSTS LOADING */}

        {postsLoading ? (

          <p className="profile-status">
            Loading posts...
          </p>

        ) : posts.length === 0 ? (

          // NO POSTS

          <p className="profile-status">
            No posts yet.
          </p>

        ) : (

          // POSTS

          <div className="profile-post-grid">

            {posts.map(post => (

              <div
                className="profile-post"
                key={post._id}
              >

                {post.images?.url && (

                  <img
                    src={post.images.url}
                    alt={
                      post.caption ||
                      "Post"
                    }
                  />

                )}

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default Profile;