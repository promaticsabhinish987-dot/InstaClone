const http = require("http");
const app = require("./app")
const dbConnect = require("./config/db")
const PORT = 4000;
const express=require("express")
const messageSocket = require("./sockets/message.socket");
const { Server } = require("socket.io")
const socketAuthMiddleware=require("./middleware/ socketAuthMiddleware")
const storage = require("./config/storage");

(async () => {
  await storage.init();
})();

dbConnect();



const server = http.createServer(app);

const io = new Server(server, {
   cors: {
      origin: "http://localhost:4200",
      credentials: true
   }
});

app.use(express.json())

io.use(socketAuthMiddleware);  // JWT check first
messageSocket(io);             // Then register events


server.listen(PORT, () => {
   console.log("your server is running at port 4000 http://localhost:4000")
})