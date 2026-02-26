const userRoute=require("express").Router();
const {registeruser,login,userProfileData,logout,getUsersList,getAllPost,getUserProfileWithUserId,
   updateProfile
} =require("./user.controller")
const authMiddleware=require("./../../middleware/auth")


userRoute.post("/register",registeruser)
userRoute.post("/login",login)
userRoute.get("/logout",logout)
userRoute.get("/profile",authMiddleware,userProfileData)
userRoute.get("/postList",authMiddleware,getAllPost)
userRoute.get("/userList",authMiddleware,getUsersList)
userRoute.get("/userProfile",authMiddleware,getUserProfileWithUserId)
userRoute.post("/profile/update",authMiddleware,updateProfile)

module.exports=userRoute;