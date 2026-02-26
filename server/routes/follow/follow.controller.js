const Follow=require("./../../models/Follow");
const User=require("../../models/User")

const followToggle=async (req,res)=>{
   try{

      const {userId}=req.query;

      if(userId==req.user._id){
         return res.status(400).json({message:"You cant follow yourself"})
      }

      const isValiduser=await User.findById(userId);

      if(!isValiduser){
         return res.status(400).json({message:"Invalid user id you want to follow"})
      }
      const isAlreadyFollowing=await Follow.findOne({by:req.user._id,to:userId})
      if(isAlreadyFollowing){
         await Follow.findByIdAndDelete(isAlreadyFollowing._id);
         res.status(200).json({message:"not following"})
      }else{
         const follow=await Follow.create({by:req.user._id,to:userId});
         res.status(200).json({message:"following"})
      }
   }catch(err){
      res.status(500).json({message:"Internal server error"})
   }
}


const getYourFollowers=async (req,res)=>{
   // console.log(req.user)
   try{
      // console.log(typeof req.user._id);

      // const followers=await Follow.find({to:req.user._id}).populate("by", "name email bio avtar");
// const userId = req.user._id

// const followers = await Follow.aggregate([
//   { $match: { to: userId } }
// ]);

// console.log(followers)

      const followers = await Follow.aggregate([
  { $match: { to: req.user._id } },
  {
    $lookup: {
      from: "users",
      localField: "by",
      foreignField: "_id",
      as: "by"
    }
  },
  { $unwind: "$by" },
  { $replaceRoot: { newRoot: "$by" } }, 
  {
    $project: {
      _id: 1,
      name: 1,
      email:1,
      avtar:1,
      state:"Follower"
    }
  }
])

      res.status(200).json({message:"Get your followers",data:followers})


   }catch(err){
      res.status(500).json({message:"Internal server error"})
   }
}



const getYourFollowing=async (req,res)=>{
   try{

      // const followers=await Follow.find({by:req.user._id}).populate("to", "name email bio avtar");
          const followers = await Follow.aggregate([
  { $match: { by: req.user._id } },
  {
    $lookup: {
      from: "users",
      localField: "to",
      foreignField: "_id",
      as: "to"
    }
  },
  { $unwind: "$to" },
  { $replaceRoot: { newRoot: "$to" } }, 
  {
    $project: {
      _id: 1,
      name: 1,
      email:1,
      avtar:1,
      state:"Following"

    }
  }
])
      res.status(200).json({message:"Get your following",data:followers})


   }catch(err){
      res.status(500).json({message:"Internal server error"})
   }
}

module.exports={followToggle,getYourFollowers,getYourFollowing}
