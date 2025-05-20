// Connect to WebSocket server
const socket = io();

// Elements
const welcomeScreen = document.getElementById('welcome-screen');
const playerDisplay = document.getElementById('player-display');
const playerCard = document.getElementById('player-card');
const bidResults = document.getElementById('bid-results');
const playerNameElement = document.getElementById('player-name');
const teamLogoElement = document.getElementById('team-logo');
const finalBidElement = document.getElementById('final-bid');
const confettiCanvas = document.getElementById('confetti-canvas');

// WebSocket event handlers
socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('show-player', (data) => {
    // Hide welcome screen and results
    welcomeScreen.classList.add('hidden');
    bidResults.classList.add('hidden');
    
    // Show player card
    playerDisplay.classList.remove('hidden');
    playerCard.src = `cards/${data.cardFilename}`;
    playerCard.alt = `${data.playerName} Card`;
});

socket.on('show-bid-result', (data) => {
    // Hide welcome screen and player display
    welcomeScreen.classList.add('hidden');
    playerDisplay.classList.add('hidden');
    
    // Update bid results content
    playerNameElement.textContent = data.playerName;
    teamLogoElement.src = `team-logos/${data.teamImage}`;
    finalBidElement.textContent = `₹${data.finalBid}`;
    
    // Show bid results
    bidResults.classList.remove('hidden');
    
    // Trigger confetti
    launchConfetti();
});

socket.on('show-welcome', () => {
    // Hide player and results
    playerDisplay.classList.add('hidden');
    bidResults.classList.add('hidden');
    
    // Show welcome screen
    welcomeScreen.classList.remove('hidden');
});

// Confetti animation function
function launchConfetti() {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
    
    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }
    
    const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        
        if (timeLeft <= 0) {
            return clearInterval(interval);
        }
        
        const particleCount = 50 * (timeLeft / duration);
        
        // Team colors confetti
        confetti({
            ...defaults,
            colors: ['#ff0000', '#ffd700', '#0000ff', '#00ff00', '#ff00ff'],
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        confetti({
            ...defaults,
            colors: ['#ff0000', '#ffd700', '#0000ff', '#00ff00', '#ff00ff'],
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
    }, 250);
}
