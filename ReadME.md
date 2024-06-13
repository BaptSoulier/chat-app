# Application de Discussion Vidéo et Chat Textuel

# Bienvenue sur CHATY

Ce projet est une application de discussion vidéo et chat textuel en temps réel où les utilisateurs peuvent créer une salle, inviter leurs amis avec un lien, et communiquer via vidéo et chat.

# Prérequis:
- Docker
- Docker Compose

# Installation:
Clonez le dépôt :

- git clone https://github.com/your-username/video-chat-app.git
cd video-chat-app

Construisez et démarrez les conteneurs :

- docker-compose up --build

Ouvrez votre navigateur et allez à http://localhost:3000.


## Fonctionnalités
- **Communication Vidéo** : Les utilisateurs peuvent démarrer une conversation vidéo avec les autres membres de la salle.
- **Chat Textuel** : Les utilisateurs peuvent échanger des messages texte en parallèle avec la communication vidéo.
- **Communication en Temps Réel** : Utilisation de Socket.IO pour la fonctionnalité de chat en temps réel.
- **Communication Vidéo** : Utilisation de WebRTC pour la communication vidéo en temps réel.

## Technologies Utilisées
### Frontend
- **Langages** : HTML, CSS, JavaScript
- **Bibliothèques** :
    - **Socket.IO** : Pour le chat textuel en temps réel.
    - **WebRTC** : Pour la communication vidéo en temps réel.

### Backend
- **Langage** : Node.js
- **Framework** : Express.js
- **WebSockets** : Socket.IO pour gérer la communication en temps réel entre le frontend et le backend.
- **Base de Données** : PostgreSQL pour stocker les informations des utilisateurs.

### Infrastructure
- **Docker** : Containerisation de l'application pour assurer un environnement cohérent entre le développement, les tests et la production.

## Structure du Projet
```plaintext
├───.idea
├───logs
└───Web
    ├───.idea
    ├───node_modules
    │   ├───.bin
    │   ├───@ioredis
    │   │   └───commands
    │   │       └───built
    │   ├───@socket.io
    │   │   └───component-emitter
    │   │       └───lib
    │   │           ├───cjs
    │   │           └───esm
    │   ├───@types
    │   │   ├───cookie
    │   │   ├───cors
    │   │   ├───node
    │   │   │   ├───assert
    │   │   │   ├───dns
    │   │   │   ├───fs
    │   │   │   ├───readline
    │   │   │   ├───stream
    │   │   │   └───timers
    │   │   └───uuid
    │   ├───accepts
    │   ├───array-flatten
    │   ├───base64id
    │   │   └───lib
    │   ├───bcryptjs
    │   │   ├───.vscode
    │   │   ├───bin
    │   │   ├───dist
    │   │   ├───externs
    │   │   ├───scripts
    │   │   ├───src
    │   │   │   └───bcrypt
    │   │   │       ├───prng
    │   │   │       └───util
    │   │   └───tests
    │   ├───body-parser
    │   │   └───lib
    │   │       └───types
    │   ├───bytes
    │   ├───call-bind
    │   │   ├───.github
    │   │   └───test
    │   ├───cluster-key-slot
    │   │   └───lib
    │   ├───connect-redis
    │   │   ├───.github
    │   │   │   └───workflows
    │   │   └───dist
    │   │       ├───cjs
    │   │       └───esm
    │   ├───content-disposition
    │   ├───content-type
    │   ├───cookie
    │   ├───cookie-signature
    │   ├───cors
    │   │   └───lib
    │   ├───debug
    │   │   └───src
    │   ├───define-data-property
    │   │   ├───.github
    │   │   └───test
    │   ├───denque
    │   ├───depd
    │   │   └───lib
    │   │       └───browser
    │   ├───destroy
    │   ├───ee-first
    │   ├───encodeurl
    │   ├───engine.io
    │   │   ├───build
    │   │   │   ├───parser-v3
    │   │   │   ├───transports
    │   │   │   └───transports-uws
    │   │   └───node_modules
    │   │       ├───cookie
    │   │       ├───debug
    │   │       │   └───src
    │   │       └───ms
    │   ├───engine.io-parser
    │   │   └───build
    │   │       ├───cjs
    │   │       │   └───contrib
    │   │       └───esm
    │   │           └───contrib
    │   ├───es-define-property
    │   │   ├───.github
    │   │   └───test
    │   ├───es-errors
    │   │   ├───.github
    │   │   └───test
    │   ├───escape-html
    │   ├───etag
    │   ├───express
    │   │   └───lib
    │   │       ├───middleware
    │   │       └───router
    │   ├───express-session
    │   │   ├───node_modules
    │   │   │   └───cookie-signature
    │   │   └───session
    │   ├───finalhandler
    │   ├───forwarded
    │   ├───fresh
    │   ├───fs
    │   ├───function-bind
    │   │   ├───.github
    │   │   └───test
    │   ├───get-intrinsic
    │   │   ├───.github
    │   │   └───test
    │   ├───gopd
    │   │   ├───.github
    │   │   └───test
    │   ├───has-property-descriptors
    │   │   ├───.github
    │   │   └───test
    │   ├───has-proto
    │   │   ├───.github
    │   │   └───test
    │   ├───has-symbols
    │   │   ├───.github
    │   │   └───test
    │   │       └───shams
    │   ├───hasown
    │   │   └───.github
    │   ├───http-errors
    │   ├───https
    │   ├───iconv-lite
    │   │   ├───encodings
    │   │   │   └───tables
    │   │   └───lib
    │   ├───inherits
    │   ├───ioredis
    │   │   ├───built
    │   │   │   ├───cluster
    │   │   │   ├───connectors
    │   │   │   │   └───SentinelConnector
    │   │   │   ├───constants
    │   │   │   ├───errors
    │   │   │   ├───redis
    │   │   │   └───utils
    │   │   └───node_modules
    │   │       ├───debug
    │   │       │   └───src
    │   │       └───ms
    │   ├───ipaddr.js
    │   │   └───lib
    │   ├───lodash.defaults
    │   ├───lodash.isarguments
    │   ├───media-typer
    │   ├───merge-descriptors
    │   ├───methods
    │   ├───mime
    │   │   └───src
    │   ├───mime-db
    │   ├───mime-types
    │   ├───ms
    │   ├───negotiator
    │   │   └───lib
    │   ├───object-assign
    │   ├───object-inspect
    │   │   ├───.github
    │   │   ├───example
    │   │   └───test
    │   │       └───browser
    │   ├───on-finished
    │   ├───on-headers
    │   ├───parseurl
    │   ├───path
    │   ├───path-to-regexp
    │   ├───pg
    │   │   └───lib
    │   │       ├───crypto
    │   │       └───native
    │   ├───pg-cloudflare
    │   │   ├───dist
    │   │   └───src
    │   ├───pg-connection-string
    │   ├───pg-int8
    │   ├───pg-pool
    │   │   └───test
    │   ├───pg-protocol
    │   │   ├───dist
    │   │   └───src
    │   │       ├───testing
    │   │       └───types
    │   ├───pg-types
    │   │   ├───lib
    │   │   └───test
    │   ├───pgpass
    │   │   └───lib
    │   ├───postgres-array
    │   ├───postgres-bytea
    │   ├───postgres-date
    │   ├───postgres-interval
    │   ├───process
    │   ├───proxy-addr
    │   ├───qs
    │   │   ├───.github
    │   │   ├───dist
    │   │   ├───lib
    │   │   └───test
    │   ├───random-bytes
    │   ├───range-parser
    │   ├───raw-body
    │   ├───redis-errors
    │   │   └───lib
    │   ├───redis-parser
    │   │   └───lib
    │   ├───safe-buffer
    │   ├───safer-buffer
    │   ├───send
    │   │   └───node_modules
    │   │       └───ms
    │   ├───serve-static
    │   ├───set-function-length
    │   │   └───.github
    │   ├───setprototypeof
    │   │   └───test
    │   ├───side-channel
    │   │   ├───.github
    │   │   └───test
    │   ├───socket.io
    │   │   ├───client-dist
    │   │   ├───dist
    │   │   └───node_modules
    │   │       ├───debug
    │   │       │   └───src
    │   │       └───ms
    │   ├───socket.io-adapter
    │   │   ├───dist
    │   │   │   └───contrib
    │   │   └───node_modules
    │   │       ├───debug
    │   │       │   └───src
    │   │       └───ms
    │   ├───socket.io-parser
    │   │   ├───build
    │   │   │   ├───cjs
    │   │   │   ├───esm
    │   │   │   └───esm-debug
    │   │   └───node_modules
    │   │       ├───debug
    │   │       │   └───src
    │   │       └───ms
    │   ├───split2
    │   ├───standard-as-callback
    │   │   └───built
    │   ├───statuses
    │   ├───toidentifier
    │   ├───type-is
    │   ├───uid-safe
    │   ├───undici-types
    │   ├───unpipe
    │   ├───util
    │   │   ├───node_modules
    │   │   │   └───inherits
    │   │   └───support
    │   ├───utils-merge
    │   ├───uuid
    │   │   └───dist
    │   │       ├───bin
    │   │       ├───esm-browser
    │   │       ├───esm-node
    │   │       └───umd
    │   ├───uuidv4
    │   │   ├───build
    │   │   │   └───lib
    │   │   └───lib
    │   ├───vary
    │   ├───ws
    │   │   └───lib
    │   └───xtend
    └───public
