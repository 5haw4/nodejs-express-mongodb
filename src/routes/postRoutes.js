const express = require("express")
const Post = require("../models/postModel")
const catchAsync = require("../utils/catchAsync")
const APIFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");

const router = express.Router();

//read all
router.route("/").get(catchAsync(async (req, res, next) => {
    const apiFeatures = new APIFeatures(Post.find(), req.query)
        .filter(['title','description','difficulty'])
        .sort()
        .limitFields(['_id','title','description','difficulty','createdAt','updatedAt'])
        .paginate();
    const posts = await apiFeatures.query;
    return res.json({results: posts.length, data: {posts: posts.map(post => cleanPost(post))}})
}))

//read one
router.route("/:id").get(getPost(), (req, res) => {
    res.json(cleanPost(req.post))
})

//create
router.route("/").post(catchAsync(async (req, res, next) => {
    const { title, description, difficulty } = req.body;
    const data = await Post.create({ title, description, difficulty })
    return res.status(201).json({post: cleanPost(data)})
}))

//update
router.route("/:id").patch(getPost(), catchAsync(async (req, res, next) => {
    const { title, description, difficulty } = req.body;
    let newData = {}
    if(title) {
        newData.title = title
    }
    if(description) {
        newData.description = description
    }
    if(typeof difficulty == "number") {
        newData.difficulty = difficulty
    }
    if(Object.keys(newData).length <= 0) {
        return res.json({ message: "No data was provided" })
    }
    const data = await Post.findByIdAndUpdate(req.post._id, newData, {
        new: true, runValidators: true
    })
    return res.json({post: cleanPost(data)})
}))

//delete
router.route("/:id").delete(getPost(), catchAsync(async (req, res, next) => {
    await req.post.remove()
    return res.json({message: "Post deleted!"})
}))

function getPost() {
    return catchAsync(async (req, res, next) => {
        const { id } = req.params;
        const data = await Post.findById(id)
        if(data) {
            req.post = data;
            next()
        } else {
            return new AppError("Post couldn't be found", 404)
        }
    })
}

const cleanPost = (post) => {
    return {
        id: post._id,
        title: post.title,
        description: post.description,
        createdAt: post.createdAt,
        updatedAt: post.createdAt == post.updatedAt ? undefined : post.updatedAt,
        difficulty: post.difficulty,
    }
}

module.exports = router;