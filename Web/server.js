const fs = require('fs');
const express = require('express');
const https = require('https');
const socketIo = require('socket.io');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const Redis = require('ioredis');
const RedisStore = require('connect-redis').default;
const { Client } = require('pg');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');  // Remplacer bcrypt par bcryptjs

const app = express();
const messagesFile = 'messages.json';

console.log('Starting server...');

// Charger les certificats
const options = {
    key: fs.readFileSync('./server.key'),
    cert: fs.readFileSync('./server.cert')
};

// Configurer la connexion Redis
const redisClient = new Redis({
    host: 'redis', // Correspond au nom du service Redis dans Docker Compose
    port: 6379,
    maxRetriesPerRequest: 100, // Augmenter le nombre de tentatives de connexion
    retryStrategy: times => {
        // Reconnecter après
        const delay = Math.min(times * 50, 2000);
        return delay;
    }
});

redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});

// Configurer la session pour utiliser Redis
app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: 'secretKey',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Mettez true si vous utilisez HTTPS
}));

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

// Configurer la base de données PostgreSQL
const client = new Client({
    user: 'myuser',
    host: 'mypostgres',
    database: 'mydatabase',
    password: 'mypassword',
    port: 5432,
});
client.connect(err => {
    if (err) {
        console.error('Connection error', err.stack);
    } else {
        console.log('Connected to database');
    }
});

// Middleware d'authentification
function checkAuthentication(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
}

// Rediriger la route de base vers l'inscription
app.get('/', (req, res) => {
    if (req.session.user) {
        res.redirect('/user.html');
    } else {
        res.redirect('/');
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await client.query(
            'SELECT * FROM "User" WHERE email = $1',
            [email]
        );

        if (result.rows.length > 0) {
            const user = result.rows[0];
            const match = await bcrypt.compare(password, user.password); // Vérifier le mot de passe haché

            if (match) {
                req.session.user = user;
                res.redirect('/user.html');
            } else {
                res.send('Invalid email or password.');
            }
        } else {
            res.send('Invalid email or password.');
        }
    } catch (err) {
        console.error('Error querying database', err.stack);
        res.send('An error occurred.');
    }
});

app.post('/register', async (req, res) => {
    const { email, password, lastName, firstName, pseudo } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10); // Hacher le mot de passe

        const result = await client.query(
            'INSERT INTO "User" (email, password, "lastName", "firstName", pseudo) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [email, hashedPassword, lastName, firstName, pseudo]
        );

        req.session.user = result.rows[0];
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    } catch (err) {
        console.error('Error inserting data', err.stack);
        res.send('An error occurred.');
    }
});

// Route dynamique pour les salles de chat
app.get('/app/:roomId', checkAuthentication, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'chat.html'));
});

// Protéger les routes de l'application principale
app.get('/user.html', checkAuthentication, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'user.html'));
});

// Route pour récupérer les informations de l'utilisateur
app.get('/session-info', (req, res) => {
    if (req.session.user) {
        res.json(req.session.user);
    } else {
        res.status(401).send('No user logged in');
    }
});

// Charger les messages sauvegardés
let roomMessages = {};
if (fs.existsSync(messagesFile)) {
    roomMessages = JSON.parse(fs.readFileSync(messagesFile));
} else {
    fs.writeFileSync(messagesFile, JSON.stringify(roomMessages));
}

// Définir la variable rooms
const rooms = {};

// Créer un serveur HTTPS
const server = https.createServer(options, app);
const io = socketIo(server);

io.on('connection', socket => {
    console.log('A user connected');

    socket.on('create', room => {
        const roomId = uuidv4(); // Générer un ID de salle unique

        if (room[roomId]) {
            console.log('Attempt to create a room that already exists:', roomId);
            callback({ status: 'error', message: 'Room already exists' });
            return;
        }

        room[roomId] = {
            clients: [],
            messages: []
        };

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
