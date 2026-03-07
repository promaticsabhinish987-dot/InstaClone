const Message = require("./../models/Messag");
const Follow = require("../models/Follow");

module.exports = (io) => {

  io.on("connection", (socket) => {
console.log("connected",socket.user._id)
   //  console.log("User connected:", socket.user._id);

    // 1️⃣ Join personal private room
    const userRoom = `user:${socket.user._id}`;
    socket.join(userRoom);

    // 2️⃣ Send Message Event
    socket.on("sendMessage", async ({ receiverId, text,imageUrl }) => {
      try {
         console.log(receiverId,text,imageUrl)
        const senderId = socket.user._id;

        // 🔐 SECURITY CHECK
        // Only allow messaging if sender follows receiver or receiver follow user
        const isFollowing = await Follow.exists({
          by: senderId,
          to: receiverId
        });

          const isFollowed = await Follow.exists({
          to: senderId,
          by: receiverId
        });
        if (!isFollowing && !isFollowed) {
          return socket.emit("errorMessage", "You can only message users you follow and by your followers.");
        }

        // 💾 Save to DB
        const message = await Message.create({
          sender: senderId,
          receiver: receiverId,
          text,
          imageUrl,
          createdAt: new Date()
        });

        // 📩 Emit to receiver's room
        io.to(`user:${receiverId}`).emit("receiveMessage", message);
        io.to(`user:${senderId}`).emit("receiveMessage", message);

        // Optionally send back to sender (for confirmation)
        socket.emit("messageSent", message);

      } catch (err) {
        socket.emit("errorMessage", "Message failed.");
      }
    });

    // 3️⃣ Typing Indicator
    socket.on("typing", ({ receiverId }) => {
      io.to(`user:${receiverId}`).emit("typing", {
        from: socket.user._id
      });
    });

    // 4️⃣ Handle Disconnect
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.user._id);
    });

  });

};