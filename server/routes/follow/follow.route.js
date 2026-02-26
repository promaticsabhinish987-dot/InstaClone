const followRoute=require("express").Router();
const {followToggle,getYourFollowers,getYourFollowing}=require("./follow.controller");
const authMiddleware=require("./../../middleware/auth")

followRoute.post("/",authMiddleware,followToggle)
followRoute.get("/followers",authMiddleware,getYourFollowers)
followRoute.get("/following",authMiddleware,getYourFollowing)


module.exports=followRoute