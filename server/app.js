const express=require("express")
const app=express();
const userRoute=require("./routes/user/user.route")
const postRoute=require("./routes/post/post.route")
const commentRoute=require("./routes/comment/comment.route")
const followRoute=require("./routes/follow/follow.route")
const messageRoute=require("./routes/message/message.routes")
const cookieParser = require("cookie-parser");
const cors = require("cors");




app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));

app.use(cookieParser());

app.use(express.json())


app.use("/user",userRoute)
app.use("/post",postRoute)
app.use("/comment",commentRoute)
app.use("/follow",followRoute)
app.use("/message",messageRoute)

app.get("/",(req,res)=>{
   res.send("hello")
})




module.exports=app;