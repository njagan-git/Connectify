import axios from "axios";

async function handleFollow(userId, isFollowing) {
    try {
        let res;

        if (isFollowing) {
            // UNFOLLOW
            res = await axios.delete(
                `http://localhost:3000/users/${userId}/follow`,
                {
                    withCredentials: true
                }
            );
        } else {
            // FOLLOW
            res = await axios.post(
                `http://localhost:3000/users/${userId}/follow`,
                {},
                {
                    withCredentials: true
                }
            );
        }

        return res.data;

    } catch (err) {
        console.log(
            "Follow/Unfollow error:",
            err.response?.data || err.message
        );

        throw err;
    }
}

export default handleFollow;