const postRoute=require("express").Router();
const {createPost,deletePost,getAllPostList,createComment,deleteComment, likeToggle} =require("./post.controller")
const authMiddleware=require("../../middleware/auth")


postRoute.post("/create",authMiddleware,createPost);
postRoute.delete("/delete",authMiddleware,deletePost);
postRoute.get("/postList",authMiddleware,getAllPostList)
postRoute.post("/comment/create",authMiddleware,createComment)
postRoute.delete("/comment/delete",authMiddleware,deleteComment)
postRoute.post("/like",authMiddleware,likeToggle)

module.exports=postRoute;
