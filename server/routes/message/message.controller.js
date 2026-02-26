
const Message=require("./../../models/Messag")
const getAllMessagesWithUser=async (req,res)=>{
try{
   const {receiverId}=req.query;
   if(!receiverId){
      res.status(400).json({message:"Receiver id is required"})
   }
   console.log("reseiver",receiverId)
   console.log("sender",req.user._id)
const messages = await Message.find({
  $or: [
    { sender: req.user._id, receiver: receiverId },
    { sender: receiverId, receiver: req.user._id }
  ]
}).limit(10)
.sort({ createdAt: -1 }); 

res.status(200).json({message:"your converstation with select user",data:messages})

}catch(err){
   console.log(err)
   res.status(500).json({message:"Internal server error"})
}
}

module.exports={getAllMessagesWithUser}