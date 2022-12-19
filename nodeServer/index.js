// node server which is gonna handle the server side component which is socket.io

const io = require("socket.io")(8000);

const users = {};

io.on("connection", (socket) => {
  // if new user joins, let the other joined peoples know
  socket.on("new-user-joined", (name) => {
    users[socket.id] = name;
    socket.broadcast.emit("user-joined", name);
  });

  // if someone sends a message, broadcast it to other people
  socket.on("send", (message) => {
    socket.broadcast.emit("receive", {
      message: message,
      name: users[socket.id],
    });
  });
  // if someone disconnects then let other people on server know
  socket.on("disconnect", (message) => {
    socket.broadcast.emit("left", users[socket.id]);
    delete users[socket.id];
  });
});
