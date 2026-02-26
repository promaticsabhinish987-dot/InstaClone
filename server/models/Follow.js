const mongoose=require("mongoose");

const followSchema=mongoose.Schema({
   by:{
      type:  mongoose.Schema.Types.ObjectId,
      ref:"User",
      required:true
   },
   to:{
      type: mongoose.Schema.Types.ObjectId,
      ref:"User",
      required:true
   }
})

module.exports = mongoose.model("Follow",followSchema)