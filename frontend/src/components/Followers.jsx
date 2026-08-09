import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./Followers.css";

function Followers() {
    const { userId } = useParams();
    const navigate = useNavigate();

    const [followers, setFollowers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadFollowers() {
            try {
                const res = await axios.get(
                    `http://localhost:3000/users/${userId}`,
                    {
                        withCredentials: true
                    }
                );

                setFollowers(res.data.followers || []);

            } catch (err) {
                console.log("Error loading followers:", err);
            } finally {
                setLoading(false);
            }
        }

        loadFollowers();
    }, [userId]);

    if (loading) {
        return (
            <div className="followers-page">
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="followers-page">

            {/* Header */}
            <div className="followers-header">

                <button
                    className="back-button"
                    onClick={() => navigate(-1)}
                >
                    ←
                </button>

                <h1>Followers</h1>

            </div>


            {/* Followers list */}
            <div className="followers-list">

                {followers.length === 0 ? (

                    <p className="empty-followers">
                        No followers yet.
                    </p>

                ) : (

                    followers.map(person => (

                        <div
                            className="follower-user"
                            key={person._id}
                        >

                            {/* User information */}
                            <div
                                className="follower-user-info"
                                onClick={() =>
                                    navigate(
                                        `/profile/${person._id}`
                                    )
                                }
                            >

                                <img
                                    src={
                                        person.profilePic ||
                                        "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                                    }
                                    alt={person.username}
                                />

                                <span>
                                    {person.username}
                                </span>

                            </div>


                            {/* Follow button */}
                            <button className="follower-button">
                                Follow
                            </button>

                        </div>

                    ))

                )}

            </div>

        </div>
    );
}

export default Followers;