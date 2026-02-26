const commentRoute=require("express").Router();
const authMiddleware=require("./../../middleware/auth")
const {fetchCommentsOfPost} = require("./comment.controller")

commentRoute.get("/getComments",authMiddleware,fetchCommentsOfPost)

module.exports=commentRoute