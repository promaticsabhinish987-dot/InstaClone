const User = require("./../../models/User")
const Follow = require("./../../models/Follow")
const Post=require("./../../models/Post")
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken")
const JWT_SECRET="supersecretKey"

const registeruser = async (req, res) => {
   try {
      const { name, email, password} = req.body;
      if (!name || !email || !password) {
         return res.status(400).json({ message: "email , name, phone no is required" })
      }
      const emailAlreadyExist = await User.findOne({ email });


console.log(emailAlreadyExist,"email exist")
      if (emailAlreadyExist) {
         return res.status(409).json({ message: "Email already exist" })
      }

      //encrypt password before save
      const salt=await bcrypt.genSalt(10);
      const hashedPassword=await bcrypt.hash(password,salt)

      const user = (await User.create({ name, email, passwordHash:hashedPassword }))

  
         return res.status(201).json({ message: "User created succesfully ", user })


   } catch (err) {
      console.log(err)
      return res.status(500).json({ message: "Internal server error" })
   }
}


const login = async (req,res) => {
   console.log(req.body)
   try{
     const {email,password}=req.body;
     if(!email || !password){
      return res.status(400).json({message:"Email and password both are required"})
     }

     const isRegisterd=await User.findOne({email});

     if(!isRegisterd){
        return res.status(401).json({messge:"Invalid credentials"});
     }

    //verify password
    const isMatch=await bcrypt.compare(password,isRegisterd.passwordHash)

     if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    //generate toekn

    const token=jwt.sign(
      {id:isRegisterd._id},
      JWT_SECRET,
      {expiresIn:"7d"}
    )


    //store this token in cookie
 // ✅ Store token in cookie
   //  res.cookie("token", token, {
   //    httpOnly: true,              // cannot access via JS
   //    secure: process.env.NODE_ENV === "production", 
   //    sameSite: "strict",          // CSRF protection
   //    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
   //  });



//     res.cookie("token", token, {
//   httpOnly: true,
//   secure: false,          // localhost
//   sameSite: "none",       // REQUIRED for cross-origin
//   maxAge: 7 * 24 * 60 * 60 * 1000
// });

 res.cookie("token", token, {
    httpOnly: true,        // prevent JS access (XSS protection)
    secure: false,         // true in production (HTTPS only)
    sameSite: "lax",       // important for cross-origin
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  });


     res.status(200).json({message:"you are successfully login", data : isRegisterd})

   

   }catch(err){
      res.status(500).json({message:"Internal server error"})
   }
}


const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
        secure:false

   //  secure: process.env.NODE_ENV === "production"
  });

  return res.status(200).json({
    message: "Logged out successfully"
  });
};


const userProfileData=async (req,res)=>{
try{
const user=await User.findById(req.user._id).populate("followersCount").populate("followingCount")
console.log(user)
return res.status(200).json({message:"User profile data",data:user})
}catch(err){
res.status(500).json({message:"Internal server error"})
}
}

//update profile
const updateProfile=async (req,res)=>{
   try{

const {name,bio,avtar}=req.body;

const user=await User.findById(req.user._id);

// Update only if value exists
    if (name.trim() ) user.name = name;
    if (bio.trim() ) user.bio = bio;
    if (avtar.trim()) user.avtar = avtar;

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      data: user
    });


   }catch(err){
res.status(500).json({message:"Internal server error"})
   }
}


//get all the post of a user

const getAllPost=async (req,res)=>{
   try{

      const postList=await Post.find({author:req.user._id}).populate("likeCount").populate("commentCount");
      res.status(200).json({
         message:"List of all the post of a user",
         data:postList
      })

   }catch(err){
      return res.status(500).json({
         message:"Internal server error"
      })
   }
}


// get all the user

const getUsersList = async (req, res) => {
  try {
    const { q } = req.query;

    let filter = {};

    // If search query exists
    if (q && q.trim() !== "") {
      filter = {
        name: { $regex: q, $options: "i" } // case-insensitive
      };
    }

    const userList = await User.find(filter)
      .sort({ createdAt: -1 })   // show newest first (or use name:1 if needed)
      .limit(10)
      .select("name email avtar");

//

const followDocs = await Follow.find({
  by: req.user._id,
  to: { $in: userList.map(u => u._id) }
}).select("to");

const followingSet = new Set(
  followDocs.map(doc => doc.to.toString())
);

const result = userList.map(user => ({
  ...user.toObject(),
  isFollowing: followingSet.has(user._id.toString())
}));



    res.status(200).json({
      message: "Users fetched successfully",
      data: result
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
};


const getUserProfileWithUserId=async (req,res)=>{
try{
   const {userId}=req.query;
   if(!userId){
      return res.status(400).json({message:"User id is required"})
   }

   const user=await User.findById(userId).populate("followersCount").populate("followingCount").select("followersCount followingCount name email createdAt updatedAt bio avtar");
   //fetch all its post


   const postList=await Post.find({author:userId}).populate("likeCount").populate("commentCount");

   res.status(200).json({message:"user profile data",data:user,postList})


}catch(err){
   return res.status(500).json({
      message:"Internal server error"
   })
}
}


module.exports = { registeruser ,login,userProfileData,logout,getAllPost,getUsersList,getUserProfileWithUserId,updateProfile}