const Post = require("./../../models/Post")
const Comment = require("./../../models/Comment")
const Like = require("./../../models/Like")
const createPost = async (req, res) => {
   try {
      const { title, content ,postImage} = req.body;
      if (!title || !content) {
         return res.status(400).json({ message: "Title and Content both are required" })
      }

      const post = await Post.create({
         title,
         content,
         postImage,
         author: req.user._id
      })

      return res.status(200).json({ message: "Post created successfully", post })

   } catch (err) {
      return res.status(500).json({ message: "Internal server error" })
   }
}

const deletePost = async (req, res) => {
   try {
      const { postId } = req.query;
      console.log(postId)
      if (!postId) {
         return res.status(400).json({ message: "Post id is required" })
      }

      const isValidPost=await Post.findById(postId);
      if (!isValidPost) {
         return res.status(401).json({ message: "Invalid Post ID" });
      }

      if(!isValidPost.author.equals(req.user._id)){
 return res.status(401).json({message:"You cant delete others post"})
      }
       const post = await Post.findByIdAndDelete(postId);


     



      return res.status(200).json({ message: "Post deleted successfully" })


   } catch (err) {
      return res.status(500).json({ message: "Internal server error" })
   }
}



// public post routes , anyone can view , comment , like if logedin

const getAllPostList = async (req, res) => {
  try {

    // 1️⃣ Get all posts
    const listOfPost = await Post.find()
      .populate("author")
      .populate("likeCount")
      .populate("commentCount")
      .sort({ createdAt: -1 });

    // 2️⃣ Get all likes of current user
    const userLikes = await Like.find({ user: req.user._id }).select("post");

    // 3️⃣ Convert liked post IDs into Set for fast lookup
    const likedPostIds = new Set(
      userLikes.map(like => like.post.toString())
    );

    // 4️⃣ Attach isLiked flag to each post
    const result = listOfPost.map(post => {
      const postObj = post.toObject();

      return {
        ...postObj,
        isLiked: likedPostIds.has(post._id.toString())
      };
    });

    // 5️⃣ Send final response
    res.status(200).json({
      message: "List of all the post of all user",
      data: result,
      profile: req.user.name
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};



const createComment = async (req, res) => {
   try {
      const { content, postId } = req.body;
      const comment = await Comment.create({
         content,
         author: req.user._id,
         post: postId
      })


      if (!comment) {
         return res.status(401).jso({ message: "Can not create commenUnable to create comment" });
      }

      res.status(200).json({ message: "Comment created successfully" })

   } catch (err) {
      res.status(500).json({ message: "Internal server error" })
   }
}

const deleteComment = async (req, res) => {
   try {
      const { commentId } = req.query;
      if (!commentId) {
         return res.status(400).json({ message: "Comment Id is required" });
      }

      const comment = await Comment.findById(commentId);

      if (!comment) {
         return res.status(400).json({ message: "Comment not exist" });
      }

    
      //fix 1 - object comparison will always differ
      // if (comment.author != req.user._id) {
      //    return res.status(401).json({ message: "You can not delete this comment" });
      // }

      if (!comment.author.equals(req.user._id)) {
         return res.status(401).json({ message: "You cannot delete this comment" });
      }

      const deletedComment = await Comment.findByIdAndDelete(commentId);

      if (!deletedComment) {
         res.status(400).json({ message: "Unable to delete comment" })
      }
      res.status(200).json({ message: "Comment deleted successfully" })


   } catch (err) {
      res.status(500).json({ message: "Internal server error" })
   }
}



//like handling
const likeToggle=async (req,res)=>{
   try{

      const {postId}=req.query;

      if(!postId){
         return res.status(400).json({message:"Post Id is required"})
      }

      const isValiduser=await Post.findById(postId);

      if(!isValiduser){
         return res.status(400).json({message:"Invalid user POST "})
      }
      const isAlreadyLiked=await Like.findOne({user:req.user._id,post:postId})
      if(isAlreadyLiked){
         await Like.findByIdAndDelete(isAlreadyLiked._id);
         res.status(200).json({message:"not Linking anymore"})
      }else{
        await Like.create({user:req.user._id,post:postId});
         res.status(200).json({message:"I  like this post"})
      }
   }catch(err){
      res.status(500).json({message:"Internal server error"})
   }
}

// const createLike=async (req,res)=>{
//    try{
//       const {postId} =req.body;
//       if(!postId){
//          return res.status(400).json({message:"Post Id is required"})
//       }

//       const post=await Post.findById(postId);

//       if(!post){
//          return res.status(401).json({message:"post not exist"});
//       }

//       const like=await Like.create({
//          post:postId,
//          user:req.user._id

//       })

//       if(!like){
//          return res.status(400).json({message:"Can not create like"})
//       }

//       res.status(200).json({message:"Successfully liked the post"})


//    }catch(err){
//       res.status(500).json({message:"Internal server error"})
//    }
// }


// const deleteLike = async (req,res) =>{
//    try{
//       const {likeId}=req.body;
//       if(!likeId){
//          return res.status(400).json({message:"like id is required"})
//       }

//       const like = await Like.findByIdAndDelete({_id:likeId,user:req.user._id});

//       if(!like){
//          return res.status(400).json({message:"Unabole to delete like"})
//       }

//       res.status(200).json({message:"successfully deleted like"})

//    }catch(err){
//       res.status(500).json({message:"internal server error"})
//    }
// }


module.exports = {
   createPost,
   deletePost,
   getAllPostList,
   createComment,
   deleteComment,
likeToggle
}