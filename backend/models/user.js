const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose").default;

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },

    profilePic: {
        type: String,
        default: "https://img.icons8.com/nolan/1200/user-default.jpg"
    },

    bio: {
        type: String,
        default: ""
    },
    status:{
        type:String,
        default:'public',
        enum:['public','private']
    },
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],

    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]
});
//console.log(typeof passportLocalMongoose);
//console.log(passportLocalMongoose);
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);