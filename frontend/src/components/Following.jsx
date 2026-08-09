import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./Following.css";

function Following() {
    const { userId } = useParams();
    const navigate = useNavigate();

    const [following, setFollowing] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadFollowing() {
            try {
                const res = await axios.get(
                    `http://localhost:3000/users/${userId}`,
                    {
                        withCredentials: true
                    }
                );

                setFollowing(res.data.following || []);

            } catch (err) {
                console.log("Error loading following:", err);
            } finally {
                setLoading(false);
            }
        }

        loadFollowing();
    }, [userId]);

    if (loading) {
        return (
            <div className="following-page">
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="following-page">

            {/* Header */}
            <div className="following-header">

                <button
                    className="back-button"
                    onClick={() => navigate(-1)}
                >
                    ←
                </button>

                <h1>Following</h1>

            </div>


            {/* Users */}
            <div className="following-list">

                {following.length === 0 ? (

                    <p className="empty-following">
                        Not following anyone yet.
                    </p>

                ) : (

                    following.map(person => (

                        <div
                            className="following-user"
                            key={person._id}
                        >

                            {/* User information */}
                            <div
                                className="following-user-info"
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


                            {/* Button */}
                            <button className="following-button">
                                Following
                            </button>

                        </div>

                    ))

                )}

            </div>

        </div>
    );
}

export default Following;