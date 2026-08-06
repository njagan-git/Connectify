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

        const newPost = new Post(req.body);

        await newPost.save();

        res.status(201).json({
            message: "Post Created Successfully"
        });

    }
    catch(err){
        console.log(err);

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

        const post = await Post.findById(id).populate("author").populate("comments.author");

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        const alreadyLiked = post.likes.some(like =>
            like.equals(userId)
        );

        if (alreadyLiked) {
            post.likes.pull(userId);
        } else {
            post.likes.push(userId);
        }

        await post.save();

        res.json(post);

    } catch (err) {
        console.log(err);

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

    if (!text.trim()) {
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

    post.comments.push({
      text,
      author: req.user._id
    });

    await post.save();

    // Populate the user before sending back
    await post.populate("comments.author");

    res.status(201).json(post);

  } catch (err) {
    console.log(err);
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
app.get("/me", (req, res) => {
    console.log("Authenticated:", req.isAuthenticated());
    console.log("Session:", req.session);
    console.log("User:", req.user);

    if (req.isAuthenticated()) {
        return res.json({ user: req.user });
    }

    res.status(401).json({ user: null });
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
        "comments.user":req.user._id
    })
    .populate("author")
    .populate("comments.author");

    res.json(posts);

});
app.listen(3000,()=>{
    console.log("Connect to port 3000")
})
