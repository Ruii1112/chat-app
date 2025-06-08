const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// ユーザ管理用Map
const users = new Map();

io.on('connection', (socket) => {
  console.log('ユーザー接続:', socket.id);

  // 入室時にユーザ情報の送信
  socket.on('join', (name) => {
    users.set(socket.id, name);
    io.emit('user list', Array.from(users.values()));
  })

  // チャットの送信
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });

  // 退出時にユーザ情報の削除
  socket.on('disconnect', () => {
    users.delete(socket.id);
    io.emit('user list', Array.from(users.values()));
    console.log('ユーザー切断:', socket.id);
  });
});

server.listen(3000, () => {
  console.log('サーバー起動：http://localhost:3000');
});
