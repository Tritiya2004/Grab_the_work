const io = require("socket.io")(8900, {
  cors: {
    origin: "http://localhost:3000", // Allow requests from your frontend
  },
});

let users = [];

// Add a user to the users array
const addUser = (userId, socketId) => {
  if (!users.some((user) => user.userId === userId)) {
    users.push({ userId, socketId });
  }
};

// Remove a user from the users array
const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

// Get a user by userId
const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

// Socket connection logic
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Add user to the users array
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    console.log("User added:", { userId, socketId: socket.id });
    io.emit("getUsers", users); // Send updated user list to all clients
  });

  // Handle sending a message
  socket.on("sendMessage", ({ senderId, receiverId, text, chatId }) => {
    const receiver = getUser(receiverId);

    if (!receiver) {
      console.error(`Receiver with userId ${receiverId} not found.`);
      return; // Prevent further execution if the receiver is not found
    }

    io.to(receiver.socketId).emit("getMessage", {
      senderId,
      text,
      chatId,
    });

    console.log(`Message sent from ${senderId} to ${receiverId}:`, { text, chatId });
  });

  // Handle user disconnect
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
    removeUser(socket.id); // Remove user by socket ID
    io.emit("getUsers", users); // Send updated user list to all clients
  });
});
