const mongoose = require("mongoose");
const Post = require("../models/post");
const sampleData = require("./sampleData");

async function seedDB() {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/connect");

        await Post.deleteMany({});
        console.log(sampleData[0]);
//console.log(sampleData[0].images);
//console.log(sampleData[0].images.url);
        await Post.insertMany(sampleData);

        console.log("Database Seeded Successfully!");

        const posts = await Post.find({});
        console.log(posts);

        mongoose.connection.close();
    } catch (err) {
        console.log(err);
    }
}

seedDB();