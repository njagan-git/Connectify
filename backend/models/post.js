const { text } = require("express");
const mongoose = require("mongoose")
const Schema = mongoose.Schema
//const Like = require("./likes")
const User = require("./user")
 const postSchema = new Schema({
    caption: {
        type: String,
        trim: true,
        maxlength: 1000
    },

    images: 
        {
            url:{
                type:String,
                required:true
            } 
        }
    ,

    hashtags: [{
        type: String,
        lowercase: true,
        trim: true
    }],
    likes: [{
    type: Schema.Types.ObjectId,
    ref: "User"
    }],
    comments:[{
        text:{
            type:String,
            trim:true,
            maxlength:300
        },
        createAt:{
            type:Date,
            default:Date.now
        },
        author:{
            type:Schema.Types.ObjectId,
            ref:"User"
        }
    }],
    author:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
}, { timestamps: true });
 const Post = mongoose.model("Post",postSchema)
 module.exports = Post