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
    // Hide other screens
    hideAllScreens();
    
    // Set player card source
    playerCard.src = `cards/${data.cardFilename}`;
    playerCard.alt = `${data.playerName} Card`;
    
    // Show player card with animation
    playerDisplay.classList.remove('hidden');
    
    // Add entrance animation for player card
    const cardContainer = document.querySelector('.card-container');
    if (cardContainer) {
        cardContainer.style.animation = 'none';
        cardContainer.offsetHeight; // Trigger reflow
        cardContainer.style.animation = 'cardEntrance 1s ease-out';
    }
});

socket.on('show-bid-result', (data) => {
    // Hide other screens
    hideAllScreens();
    
    // Update bid results content
    playerNameElement.textContent = data.playerName;
    teamLogoElement.src = `team-logos/${data.teamImage}`;
    finalBidElement.textContent = `₹${data.finalBid} CR`;
    
    // Show bid results
    bidResults.classList.remove('hidden');
    
    // Add GSAP animations for bid result elements
    if (window.gsap) {
        animateBidResults();
    }
    
    // Trigger confetti
    launchConfetti();
});

socket.on('show-welcome', () => {
    // Hide other screens
    hideAllScreens();
    
    // Show welcome screen
    welcomeScreen.classList.remove('hidden');
    
    // Reset and restart welcome screen animations
    resetWelcomeAnimations();
});

function hideAllScreens() {
    welcomeScreen.classList.add('hidden');
    playerDisplay.classList.add('hidden');
    bidResults.classList.add('hidden');
}

function resetWelcomeAnimations() {
    const title = document.querySelector('.title-animated');
    const subtitle = document.querySelector('.subtitle-animated');
    
    if (title) {
        title.style.animation = 'none';
        title.offsetHeight; // Trigger reflow
        title.style.animation = 'titleEntrance 1.5s ease-out 0.3s forwards';
    }
    
    if (subtitle) {
        subtitle.style.animation = 'none';
        subtitle.offsetHeight; // Trigger reflow
        subtitle.style.animation = 'subtitleEntrance 1.5s ease-out 0.6s forwards';
    }
}

function animateBidResults() {
    gsap.fromTo('.result-player-name', 
        {y: -50, opacity: 0},
        {y: 0, opacity: 1, duration: 0.8, ease: 'power2.out'}
    );
    
    gsap.fromTo('.team-section',
        {y: 30, opacity: 0},
        {y: 0, opacity: 1, duration: 0.8, delay: 0.3, ease: 'power2.out'}
    );
    
    gsap.fromTo('.price-section',
        {y: 30, opacity: 0},
        {y: 0, opacity: 1, duration: 0.8, delay: 0.6, ease: 'power2.out'}
    );
    
    gsap.fromTo('.celebration-badge',
        {opacity: 0},
        {opacity: 1, duration: 0.5, delay: 1.0, ease: 'power1.in'}
    );
}

// Enhanced confetti animation function
function launchConfetti() {
    const duration = 8 * 1000;
    const animationEnd = Date.now() + duration;
    
    // Team colors - IPL team colors
    const colors = [
        '#ff9933', // Orange (SRH)
        '#004c93', // Blue (MI)
        '#fcb415', // Yellow (CSK)
        '#a61832', // Red (PBKS) 
        '#2561ae', // Blue (DC)
        '#3b215e', // Purple (KKR)
        '#D1132B', // Red (RCB)
        '#ff5757', // Pink (RR)
        '#1d2951', // Navy (GT)
        '#a7ce3a'  // Lime (LSG)
    ];
    
    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }
    
    // Initial burst
    confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: colors,
        startVelocity: 30,
        gravity: 0.8,
        ticks: 400,
        shapes: ['square', 'circle'],
    });
    
    // Continuous confetti
    const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        
        if (timeLeft <= 0) {
            return clearInterval(interval);
        }
        
        const particleCount = 50 * (timeLeft / duration);
        
        // Left side
        confetti({
            particleCount: Math.floor(particleCount),
            angle: randomInRange(30, 60),
            spread: randomInRange(50, 70),
            origin: { x: 0, y: 0.5 },
            colors: colors,
            startVelocity: randomInRange(25, 35),
            gravity: 1,
            ticks: 200,
            decay: 0.94,
            shapes: ['square', 'circle'],
        });
        
        // Right side
        confetti({
            particleCount: Math.floor(particleCount),
            angle: randomInRange(120, 150),
            spread: randomInRange(50, 70),
            origin: { x: 1, y: 0.5 },
            colors: colors,
            startVelocity: randomInRange(25, 35),
            gravity: 1,
            ticks: 200,
            decay: 0.94,
            shapes: ['square', 'circle'],
        });
    }, 250);
    
    // Final burst after delay
    setTimeout(() => {
        confetti({
            particleCount: 200,
            spread: 180,
            origin: { x: 0.5, y: 0.5 },
            colors: colors,
            startVelocity: 45,
            gravity: 0.7,
            ticks: 400,
            shapes: ['square', 'circle'],
        });
    }, 2500);
}
