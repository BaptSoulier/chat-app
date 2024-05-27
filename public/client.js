let isCaller;
let rtcPeerConnection;
let localStream;

const socket = io.connect(window.location.origin);

const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const roomName = document.getElementById('roomName');
const roomStatus = document.getElementById('roomStatus');

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

function createRoom() {
    if (roomName.value === '') {
        alert('Please enter a room name to create');
        return;
    }
    console.log('Creating room:', roomName.value);
    socket.emit('create', roomName.value);
}

function joinRoom() {
    if (roomName.value === '') {
        alert('Please enter a room name to join');
        return;
    }
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

socket.on('full', room => {
    alert(`Room ${room} is full`);
});

socket.on('error', message => {
    alert(message);
    console.error(message);
});
