async function fetchUserInfo() {
    const userId = 1; // Replace with the actual user ID
    const response = await fetch(`/user-info?id=${userId}`);
    const userInfo = await response.json();

    const userInfoContainer = document.getElementById('user-info');
    userInfoContainer.innerHTML = `
        <h1>User Info</h1>
        <p><strong>Name:</strong> ${userInfo.firstName} ${userInfo.lastName}</p>
        <p><strong>Email:</strong> ${userInfo.email}</p>
        <p><strong>Pseudo:</strong> ${userInfo.pseudo}</p>
        <p><strong>ID FTP:</strong> ${userInfo.idFTP}</p>
    `;
}

document.addEventListener('DOMContentLoaded', fetchUserInfo);

function generateRoomId(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

function createRoom() {
    const roomId = generateRoomId(10);
    window.location.href = `/app/${roomId}`;
}

function joinRoom() {
    const roomName = document.getElementById('roomName').value;
    if (roomName.trim()) {
        window.location.href = `/app/${roomName}`;
    } else {
        alert('Please enter a room ID');
    }
}