const mongoose = require("mongoose")

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title was not provided"],
        trim: true,
        maxlength: [40, "Title must be 40 chars or less"],
        minlength: [10, "Title must have at least 10 chars"],
        index: { unique: true }
    },
    description: {
        type: String,
        required: [true, "Description was not provided"],
        trim: true,
        maxlength: [500, "Description must be 500 chars or less"],
        minlength: [25, "Description must have at least 25 chars"],
    },
    difficulty: {
        type: Number,
        required: [true, "Difficulty was not provided"],
        default: 0,
        min: [0, "Difficulty must be 0 or greater"],
        max: [10, "Difficulty must be 10 or smaller"]
    },
    postType: {
        type: String,
        enum: { values: ["text", "photo", "video"], message: "Post type must be text, photo or video" }
    },
    createdAt: Number,
    updatedAt: Number,
}, { 
    timestamps: { 
        currentTime: () =>  new Date().getTime() 
    } 
})

module.exports = mongoose.model("Post", postSchema)