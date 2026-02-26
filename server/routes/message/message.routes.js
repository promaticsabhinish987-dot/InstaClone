const messageRoute=require("express").Router();
const {getAllMessagesWithUser}=require("./message.controller")
const authMiddleware=require("./../../middleware/auth")

messageRoute.get("/history",authMiddleware,getAllMessagesWithUser)

module.exports=messageRoute;