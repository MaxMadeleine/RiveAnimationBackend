const express = require("express");
const app = express();
const http = require("http");
const PORT = 3000;

// Create Express http server
const server = http.createServer(app);

// Server listens on port
server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});

// Initialize Socket IO on server
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "https://your-sheep.netlify.app/",
  },
});

// Here we need to create the states for the rive animation and
// set up an interval that updates the values

let numHealth = 100;
let isSad = false;

// Start interval that ticks down health every 5 seconds and emits the current numHealth to all clients
setInterval(() => {
  if (numHealth > 0) {
    numHealth = numHealth - 1;
    if (numHealth < 80) {
      isSad = true;
    } else {
      isSad = false;
    }
    io.sockets.emit("status", { hp: numHealth, isSad: isSad });
    console.log(numHealth);
    
  }
}, 5000);

// A user connects to the server (opens a socket)
io.sockets.on("connection", function (socket) {
  // Server recieves a feed ping and updates health
  socket.on("feed", (data) => {
    if (numHealth <= 90) {
      numHealth = numHealth + 10;
    } else {
      numHealth = 100;
    }
    console.log("Recieved feed ping: ", data);
    io.sockets.emit("feed", { hp: numHealth, isSad: isSad });
  });
});
