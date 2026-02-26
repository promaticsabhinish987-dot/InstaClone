const mongoose=require("mongoose")
const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    content: {
      type: String,
      required: true
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    postImage:{
      type:String
    }

    // isPublished: {
    //   type: Boolean,
    //   default: true
    // }
  },
  { timestamps: true }
);

// Virtual for likeCount
postSchema.virtual("likeCount", {
  ref: "Like",
  localField: "_id",
  foreignField: "post",
  count: true
});

// Virtual for commentCount
postSchema.virtual("commentCount", {
  ref: "Comment",
  localField: "_id",
  foreignField: "post",
  count: true
});

// postSchema.virtual("comments", {
//   ref: "Comment",
//   localField: "_id",
//   foreignField: "post"
// });

postSchema.set("toObject", { virtuals: true });
postSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Post", postSchema);


//fix 2
// Virtuals do nothing unless you populate them.

// This is critical.

// ✅ Correct Usage
// const posts = await Post.find()
//   .populate("likeCount")
//   .populate("commentCount");

// Now each post will have:

// post.likeCount
// post.commentCount