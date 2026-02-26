const Comment =require("./../../models/Comment");

const fetchCommentsOfPost=async (req,res)=>{

   try{

      const {postId}=req.query;

      if(!postId){
         return res.status(400).json({message:"post id is required"})
      }

      const comments=await Comment.find({post:postId}).populate("author");
               console.log(comments)
      if(!comments){
         return res.status(401).json({message:"We have no comment to show "})
      }

      return res.status(200).json({
         comments,
         profile:req.user
      })


   }catch(err){
      res.status(500).json({message:'Internal server error'})
   }
}

// const createComment=async ()=>{
//    try{

//    }catch(err){
//       res.status(500).json({message:"Internal server error"})
//    }
// }


module.exports={
   fetchCommentsOfPost
}