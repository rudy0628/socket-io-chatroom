const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

app.use(cors());

const server = http.createServer(app);

// create a io server
const io = new Server(server, {
	cors: {
		origin: '*',
		method: ['GET', 'POST'],
	},
});

const messages = {};

//create io connection(everyone who listening to this server)
io.on('connection', socket => {
	//join room
	socket.on('join_room', data => {
		socket.join(data);
		messages[data] = [];
	});

	// get the message from frontend
	socket.on('send_message', data => {
		// send the message back for everyone who listening this server
		if (data.room) {
			messages[data.room].push(data.message);
			socket.to(data.room).emit('receive_message', messages);
		}
	});
});

server.listen(5000, () => {
	console.log('Server is running on PORT 5000');
});
