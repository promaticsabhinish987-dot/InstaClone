const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true
    },
    avtar:{
    type:String
    },

    passwordHash: {
      type: String,
      required: true
    },

    bio: {
      type: String,
      default: ""
    },

    // likedPosts: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Post"
    //   }
    // ],

    // comments: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Comment"
    //   }
    // ]
  },
  { timestamps: true }
);

userSchema.virtual("followersCount",{
  ref:"Follow",
  localField:"_id",
  foreignField:"to",
  count:true
});

userSchema.virtual("followingCount",{
  ref:"Follow",
  localField:"_id",
  foreignField:"by",
  count:true
});


userSchema.set("toObject", { virtuals: true });
userSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("User", userSchema);