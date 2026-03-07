const postRoute=require("express").Router();
const {createPost,deletePost,getAllPostList,createComment,deleteComment, likeToggle} =require("./post.controller")
const authMiddleware=require("../../middleware/auth")
const multer=require("multer")
const upload = multer({ storage: multer.memoryStorage() }); 

postRoute.post("/create",authMiddleware,upload.single("postImage"),createPost);
postRoute.delete("/delete",authMiddleware,deletePost);
postRoute.get("/postList",authMiddleware,getAllPostList)
postRoute.post("/comment/create",authMiddleware,createComment)
postRoute.delete("/comment/delete",authMiddleware,deleteComment)
postRoute.post("/like",authMiddleware,likeToggle)


module.exports=postRoute;
