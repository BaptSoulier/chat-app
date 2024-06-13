let isCaller;
let rtcPeerConnection;
let localStream;
let userName;

const socket = io.connect(window.location.origin);

const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const roomName = document.getElementById('roomName');
const roomStatus = document.getElementById('roomStatus');
const messages = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');

const streamConstraints = { audio: true, video: true };
const iceServers = {
    iceServers: [
        { urls: 'stun:stun.services.mozilla.com' },
        { urls: 'stun:stun.l.google.com:19302' }
    ]
};

navigator.mediaDevices.getUserMedia(streamConstraints)
    .then(stream => {
        localStream = stream;
        localVideo.srcObject = stream;
        localVideo.play();
        console.log('Local stream obtained');
    })
    .catch(error => {
        console.error('Error accessing media devices.', error);
    });

function createPeerConnection() {
    rtcPeerConnection = new RTCPeerConnection(iceServers);

    rtcPeerConnection.onicecandidate = event => {
        if (event.candidate) {
            socket.emit('candidate', roomName.value, event.candidate);
        }
    };

    rtcPeerConnection.ontrack = event => {
        remoteVideo.srcObject = event.streams[0];
    };

    rtcPeerConnection.oniceconnectionstatechange = () => {
        console.log('ICE state:', rtcPeerConnection.iceConnectionState);
    };

    localStream.getTracks().forEach(track => {
        rtcPeerConnection.addTrack(track, localStream);
    });
}

function generateRandomId(length = 10) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charactersLength);
        result += characters.charAt(randomIndex);
    }

    return result;
}

function createRoom() {
    roomName.value = generateRandomId();
    userName = 'User 1';
    console.log('Creating room:', roomName.value);
    socket.emit('create', roomName.value);
}

function joinRoom() {
    if (roomName.value === '') {
        alert('Please enter a room name to join');
        return;
    }
    userName = 'User 2';
    console.log('Joining room:', roomName.value);
    socket.emit('join', roomName.value);
}

socket.on('created', room => {
    isCaller = true;
    console.log('Room created:', room);
    roomStatus.textContent = `Room created: ${room}`;
});

socket.on('joined', room => {
    isCaller = false;
    console.log('Joined room:', room);
    roomStatus.textContent = `Joined room: ${room}`;
    socket.emit('ready', room);
});

socket.on('ready', () => {
    if (isCaller) {
        createPeerConnection();
        rtcPeerConnection.createOffer()
            .then(sessionDescription => {
                rtcPeerConnection.setLocalDescription(sessionDescription);
                socket.emit('offer', roomName.value, sessionDescription);
            })
            .catch(error => console.error('Error creating offer:', error));
    }
});

socket.on('offer', description => {
    createPeerConnection();
    rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(description))
        .then(() => rtcPeerConnection.createAnswer())
        .then(sessionDescription => {
            rtcPeerConnection.setLocalDescription(sessionDescription);
            socket.emit('answer', roomName.value, sessionDescription);
        })
        .catch(error => console.error('Error handling offer:', error));
});

socket.on('answer', description => {
    rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(description))
        .catch(error => console.error('Error setting remote description:', error));
});

socket.on('candidate', candidate => {
    rtcPeerConnection.addIceCandidate(new RTCIceCandidate(candidate))
        .catch(error => console.error('Error adding received ICE candidate:', error));
});

socket.on('messages', messagesList => {
    messages.innerHTML = '';
    messagesList.forEach(message => {
        displayMessage(message);
    });
});

socket.on('message', message => {
    displayMessage(message);
});

socket.on('full', room => {
    alert(`Room ${room} is full`);
});

socket.on('error', message => {
    alert(message);
    console.error(message);
});

function sendMessage() {
    const text = messageInput.value;
    if (text.trim()) {
        const message = { userName, text };
        socket.emit('message', roomName.value, message);
        messageInput.value = '';
        displayMessage(message);
    }
}

function displayMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.className = message.userName === userName ? 'message user1' : 'message user2';
    messageElement.textContent = `${message.userName}: ${message.text}`;
    messages.appendChild(messageElement);
    messages.scrollTop = messages.scrollHeight; // Scroll to the bottom
}
