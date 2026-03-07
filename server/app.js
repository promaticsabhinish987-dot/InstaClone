const express=require("express")
const app=express();
const userRoute=require("./routes/user/user.route")
const postRoute=require("./routes/post/post.route")
const commentRoute=require("./routes/comment/comment.route")
const followRoute=require("./routes/follow/follow.route")
const messageRoute=require("./routes/message/message.routes")
const cookieParser = require("cookie-parser");
const cors = require("cors");
const storage=require("./config/storage")
const multer=require("multer")
const upload = multer({ storage: multer.memoryStorage() }); 
const authMiddleware=require("./middleware/auth")




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

app.get("/files/:id", async (req, res) => {
  const file = await storage.get(req.params.id);
  res.set("Content-Type", file.contentType);
  res.send(file.data);
});

app.post("/upload", upload.single("msgImage"),authMiddleware, async (req, res) => {
  const result = await storage.upload(req.file);
  console.log("image uploaded successfully")
  res.json({imageUrl:result?.key});
});

app.delete("/files/:id",authMiddleware, async (req, res) => {
  await storage.delete(req.params.id);
  res.json({
    success: true,
    message: "File deleted successfully"
  });
})



app.get("/",(req,res)=>{
   res.send("hello")
})




module.exports=app;