const jwt=require("jsonwebtoken");
const JWT_SECRET="supersecretKey";
const User=require("../models/User")



const authMiddleware = async (req,res,next)=>{
try{
   const token=req.cookies.token;

   if(!token){
      return res.status(401).json({
         message:"Unauthorized"
      })
   }

   const decoded=jwt.verify(token,JWT_SECRET);
   
   const user=await User.findById(decoded.id).select("-passwordHash");

   if(!user){
      return res.status(401).json({
         message:"Unauthorized"
      })
   }

   req.user=user;
   next();

}catch(err){
   return res.status(401).json({
      message: "Unauthorized"
    });
}
}


module.exports=authMiddleware