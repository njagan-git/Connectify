const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose");
const Post = require("./models/post")
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

const app = express()
mongoose.connect("mongodb://127.0.0.1:27017/connect")
.then(() => {
    console.log("MongoDB Connected");
})
.catch((err) => {
    console.log("Connection Error:", err);
});
app.use(cors({
    origin: "http://localhost:5173", // your Vite/React dev server URL
    credentials: true
}));app.use(express.json())
app.use(express.json());

app.use(session({
    secret: "mysecret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: "mongodb://127.0.0.1:27017/connect"
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());

passport.deserializeUser(User.deserializeUser());
app.get("/posts",async(req,res)=>{
    try{
     const postData = await Post.find({}).populate("author").populate('likes').populate("comments.author")
     console.log(postData)
     res.json(postData)
    }
    catch(err){
        res.json("error")
    }
})
app.post("/posts", async (req, res) => {
    try {

        if (!req.isAuthenticated()) {
            return res.status(401).json({
                message: "Please login first"
            });
        }

        const newPost = new Post({
            caption: req.body.caption,
            images: req.body.images,
            hashtags: req.body.hashtags,
            author: req.user._id
        });

        await newPost.save();

        // Populate author before returning
        await newPost.populate("author");

        res.status(201).json({
            message: "Post Created Successfully",
            post: newPost
        });

    } catch (err) {

        console.log("Create post error:", err);

        res.status(500).json({
            message: "Error creating post"
        });
    }
});
app.patch("/posts/:id/like", async (req, res) => {
    try {

        if (!req.isAuthenticated()) {
            return res.status(401).json({
                message: "Please login first"
            });
        }

        const { id } = req.params;
        const userId = req.user._id;

        const post = await Post.findById(id)
            .populate("author")
            .populate("comments.author");

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        const alreadyLiked = post.likes.some(like =>
            like.toString() === userId.toString()
        );

        if (alreadyLiked) {

            // UNLIKE
            post.likes.pull(userId);

        } else {

            // LIKE
            post.likes.push(userId);

        }

        await post.save();

        // IMPORTANT
        // Populate likes before sending response
        await post.populate("likes", "username profilePic");

        res.json(post);

    } catch (err) {

        console.log("Like error:", err);

        res.status(500).json({
            message: "Something went wrong"
        });
    }
});
app.post("/posts/:id/comments", async (req, res) => {
    try {

        if (!req.isAuthenticated()) {
            return res.status(401).json({
                message: "Please login first"
            });
        }

        const { id } = req.params;
        const { text } = req.body;

        if (!text || !text.trim()) {
            return res.status(400).json({
                message: "Comment text is required"
            });
        }

        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        // Add comment with logged-in user
        post.comments.push({
            text: text.trim(),
            author: req.user._id
        });

        await post.save();

        // IMPORTANT: populate the same data your PostList expects
        await post.populate([
            {
                path: "author",
                select: "username profilePic"
            },
            {
                path: "likes",
                select: "username profilePic"
            },
            {
                path: "comments.author",
                select: "username profilePic"
            }
        ]);

        res.status(201).json(post);

    } catch (err) {

        console.log("Comment error:", err);

        res.status(500).json({
            message: "Failed to add comment"
        });
    }
});
app.post("/register", async (req, res) => {

    const { username, email, password ,profilePic,bio,status} = req.body;

    const user = new User({
        username,
        email,
        profilePic,
        bio,
        status
    });

    const registeredUser =
        await User.register(user, password);
    console.log(user)

    res.json(registeredUser);

});
app.post("/login", passport.authenticate("local"), (req, res) => {
    res.json({
        message: "Logged in successfully",
        user: {
            _id: req.user._id,
            username: req.user.username,
            email: req.user.email,
            profilePic: req.user.profilePic
        }
    });
});
app.post("/logout", (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }

        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({
                    message: "Logout failed"
                });
            }

            res.clearCookie("connect.sid");

            res.json({
                message: "Logged out successfully"
            });
        });
    });
});
app.get("/me", async (req, res) => {
    try {
        if (!req.isAuthenticated()) {
            return res.status(401).json({
                user: null
            });
        }

        const user = await User.findById(req.user._id)
            .populate("followers", "username profilePic")
            .populate("following", "username profilePic");

        res.json({
            user
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            message: "Failed to get user"
        });
    }
});
app.get("/myposts", async (req,res)=>{

    if(!req.isAuthenticated())
        return res.status(401).json();

    const posts=await Post.find({
        author:req.user._id
    }).populate("author");

    res.json(posts);

});
app.get("/likedposts",async(req,res)=>{

    if(!req.isAuthenticated())
        return res.status(401).json();

    const posts=await Post.find({

        likes:req.user._id

    }).populate("author");

    res.json(posts);

});
app.get("/mycomments",async(req,res)=>{

    if(!req.isAuthenticated())
        return res.status(401).json();

    const posts=await Post.find({
        "comments.author":req.user._id
    })
    .populate("author")
    .populate("comments.author");

    res.json(posts);

});
app.post("/users/:userId/follow", async (req, res) => {

    try {

        if (!req.isAuthenticated()) {
            return res.status(401).json({
                message: "You must be logged in"
            });
        }

        const currentUserId = req.user._id;
        const targetUserId = req.params.userId;


        // Can't follow yourself

        if (
            currentUserId.toString() ===
            targetUserId.toString()
        ) {
            return res.status(400).json({
                message: "You cannot follow yourself"
            });
        }


        const currentUser =
            await User.findById(currentUserId);

        const targetUser =
            await User.findById(targetUserId);


        if (!targetUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }


        // Already following

        if (
            currentUser.following.some(
                id =>
                    id.toString() ===
                    targetUserId.toString()
            )
        ) {
            return res.status(400).json({
                message: "Already following this user"
            });
        }


        // Add target to current user's following

        currentUser.following.push(targetUserId);


        // Add current user to target's followers

        targetUser.followers.push(currentUserId);


        await currentUser.save();
        await targetUser.save();


        res.json(targetUser);

    } catch (err) {

        console.log("Follow error:", err);

        res.status(500).json({
            message: "Failed to follow user"
        });
    }
});
app.delete("/users/:userId/follow", async (req, res) => {

    try {

        if (!req.isAuthenticated()) {
            return res.status(401).json({
                message: "You must be logged in"
            });
        }

        const currentUserId = req.user._id;
        const targetUserId = req.params.userId;


        const currentUser =
            await User.findById(currentUserId);

        const targetUser =
            await User.findById(targetUserId);


        if (!targetUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }


        // Remove target from following

        currentUser.following =
            currentUser.following.filter(
                id =>
                    id.toString() !==
                    targetUserId.toString()
            );


        // Remove current user from followers

        targetUser.followers =
            targetUser.followers.filter(
                id =>
                    id.toString() !==
                    currentUserId.toString()
            );


        await currentUser.save();
        await targetUser.save();


        res.json(targetUser);

    } catch (err) {

        console.log("Unfollow error:", err);

        res.status(500).json({
            message: "Failed to unfollow user"
        });
    }
});
app.get("/users/:userId/posts", async (req, res) => {
    try {

        const posts = await Post.find({
            author: req.params.userId
        })
        .sort({ createdAt: -1 });

        res.json(posts);

    } catch (err) {

        console.log("User posts error:", err);

        res.status(500).json({
            message: "Failed to get user posts"
        });
    }
});
app.get("/users/:userId", async (req, res) => {
    try {

        const user = await User.findById(req.params.userId)
            .populate("followers", "username profilePic")
            .populate("following", "username profilePic");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json(user);

    } catch (err) {

        console.error("Get user error:", err);

        res.status(500).json({
            message: "Failed to get user"
        });
    }
});
app.listen(3000,()=>{
    console.log("Connect to port 3000")
})
