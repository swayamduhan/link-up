import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { UserService } from './services/UserService.js';
let GLOBAL_USER_ID = 1;

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors : {
        origin : '*',
        methods : ['GET', 'POST']
    },
    transports : ['websocket']
});

const userService = new UserService();

io.on('connection', (socket) => {
  console.log('a user connected');
  userService.addUser(socket, GLOBAL_USER_ID++);
  socket.on('disconnect', () => {
    userService.removeUser(socket);
  });
});

server.listen(8080, () => {
  console.log('server running at ws://localhost:8080');
});