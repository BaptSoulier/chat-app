const fs = require('fs');
const https = require('https');
const express = require('express');
const socketIO = require('socket.io');

const app = express();
const server = https.createServer({
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem')
}, app);

const io = socketIO(server);

// Charger les messages précédents
let messages = [];
fs.readFile('messages.json', (err, data) => {
    if (err) throw err;
    messages = JSON.parse(data);
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', (socket) => {
    // Envoyer tous les messages précédents au client
    socket.emit('load old messages', messages);

    socket.on('chat message', (msg) => {
        messages.push(msg); // Ajouter le nouveau message à l'array
        io.emit('chat message', msg); // Envoyer le message à tous les clients

        // Sauvegarder le message dans le fichier
        fs.writeFile('messages.json', JSON.stringify(messages), err => {
            if (err) throw err;
        });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(3000, () => {
    console.log('Listening on https://localhost:3000');
});
