// Fonction pour déplacer la souris à une position spécifique
function moveMouse(x, y) {
    var event = new MouseEvent('mousemove', {
        'view': window,
        'bubbles': true,
        'cancelable': true,
        'screenX': x,
        'screenY': y
    });
    window.dispatchEvent(event);
}

// Fonction pour déplacer la souris aléatoirement dans la fenêtre
function moveRandomly() {
    var maxX = window.innerWidth;
    var maxY = window.innerHeight;
    var newX = Math.floor(Math.random() * maxX);
    var newY = Math.floor(Math.random() * maxY);
    moveMouse(newX, newY);
}

// Boucle pour déplacer la souris à intervalles réguliers
setInterval(function() {
    moveRandomly();
}, 2000); // Répéter toutes les 2 secondes
