const express = require('express');
const https = require('https');
const fs = require('fs');
const socketIO = require('socket.io');

const app = express();
const server = https.createServer({
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
}, app);

const io = socketIO(server);

app.use(express.static('public')); // Dossier pour les fichiers statiques

io.on('connection', socket => {
    console.log('New connection:', socket.id);

    socket.on('signal', data => {
        // Transfert des données WebRTC à l'autre utilisateur
        socket.to(data.to).emit('receivedSignal', { signal: data.signal, from: socket.id });
    });

    socket.on('ready', () => {
        // Notifie les autres clients qu'un nouvel utilisateur est prêt pour la connexion
        socket.broadcast.emit('userReady', socket.id);
    });

    socket.on('disconnect', () => {
        // Notifie les autres clients qu'un utilisateur s'est déconnecté
        socket.broadcast.emit('userDisconnected', socket.id);
    });
});

server.listen(3000, () => {
    console.log('Server listening on https://localhost:3000');
});
