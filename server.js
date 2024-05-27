const fs = require('fs');
const express = require('express');
const https = require('https');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const messagesFile = 'messages.json';

// Charger les certificats
const options = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
};

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));

// Créer un serveur HTTPS
const server = https.createServer(options, app);
const io = socketIo(server);

// Charger les messages sauvegardés
let roomMessages = {};
if (fs.existsSync(messagesFile)) {
    roomMessages = JSON.parse(fs.readFileSync(messagesFile));
} else {
    fs.writeFileSync(messagesFile, JSON.stringify(roomMessages));
}

io.on('connection', socket => {
    console.log('A user connected');

    socket.on('create', room => {
        const clientsInRoom = io.sockets.adapter.rooms.get(room);
        if (clientsInRoom) {
            console.log('Attempt to create a room that already exists:', room);
            socket.emit('error', 'Room already exists');
            return;
        }

        socket.join(room);
        if (!roomMessages[room]) {
            roomMessages[room] = [];
        }
        console.log('Room created:', room);
        socket.emit('created', room);
    });

    socket.on('join', room => {
        const clientsInRoom = io.sockets.adapter.rooms.get(room);
        const numClients = clientsInRoom ? clientsInRoom.size : 0;

        if (!clientsInRoom) {
            console.log('Attempt to join a non-existent room:', room);
            socket.emit('error', 'Room does not exist');
            return;
        }

        if (numClients >= 2) {
            console.log('Attempt to join a full room:', room);
            socket.emit('full', room);
            return;
        }

        socket.join(room);
        console.log('Room joined:', room);
        socket.emit('joined', room);
        socket.emit('messages', roomMessages[room]);
        io.in(room).emit('ready');
    });

    socket.on('offer', (room, description) => {
        console.log('Offer received:', description);
        socket.to(room).emit('offer', description);
    });

    socket.on('answer', (room, description) => {
        console.log('Answer received:', description);
        socket.to(room).emit('answer', description);
    });

    socket.on('candidate', (room, candidate) => {
        console.log('Candidate received:', candidate);
        socket.to(room).emit('candidate', candidate);
    });

    socket.on('message', (room, message) => {
        if (!roomMessages[room]) {
            roomMessages[room] = [];
        }
        roomMessages[room].push(message);
        fs.writeFileSync(messagesFile, JSON.stringify(roomMessages));
        socket.to(room).emit('message', message);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

server.listen(3000, () => {
    console.log('Listening on *:3000');
});
