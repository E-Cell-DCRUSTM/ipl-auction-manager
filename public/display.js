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

// New elements for enhanced player display
const auctionTimerElement = document.getElementById('auction-timer');
const startingPriceElement = document.getElementById('starting-price');
const currentBidElement = document.getElementById('current-bid');
const biddingTeamsElement = document.getElementById('bidding-teams');

// WebSocket event handlers
socket.on('connect', () => {
    console.log('Connected to server');
});

// Spotlight effect for card
function handleMouseMove(e) {
    const cardContainer = document.querySelector('.card-container');
    if (!cardContainer) return;
    
    const rect = cardContainer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const spotlight = document.querySelector('.card-spotlight');
    if (spotlight) {
        spotlight.style.setProperty('--x', `${x}px`);
        spotlight.style.setProperty('--y', `${y}px`);
    }
    
    // Subtle 3D effect on the card
    const xRotation = ((y - rect.height / 2) / rect.height) * 5; // -2.5 to 2.5 degrees
    const yRotation = ((x - rect.width / 2) / rect.width) * -5; // -2.5 to 2.5 degrees
    
    const card = document.getElementById('player-card');
    if (card) {
        card.style.transform = `rotateX(${xRotation}deg) rotateY(${yRotation}deg)`;
    }
}

// Reset card position when mouse leaves
function handleMouseLeave() {
    const card = document.getElementById('player-card');
    if (card) {
        card.style.transform = 'rotateX(0) rotateY(0)';
    }
}

// Setup card hover effect
function setupCardHoverEffect() {
    const cardContainer = document.querySelector('.card-container');
    if (cardContainer) {
        cardContainer.addEventListener('mousemove', handleMouseMove);
        cardContainer.addEventListener('mouseleave', handleMouseLeave);
    }
}

socket.on('show-player', (data) => {
    // Hide other screens
    hideAllScreens();
    
    // Set player card source
    playerCard.src = `cards/${data.cardFilename}`;
    playerCard.alt = `${data.playerName} Card`;
    
    // Extract base price from filename or data
    // This is optional - if you don't have base price data, just use placeholder
    let basePrice = "2.00";
    if (data.basePrice) {
        basePrice = data.basePrice;
    }
    
    // Update base price display
    startingPriceElement.textContent = `₹ ${basePrice} CR`;
    
    // Reset current bid to base price
    currentBidElement.textContent = `₹ ${basePrice} CR`;
    
    // Clear any existing team chips
    biddingTeamsElement.innerHTML = '';
    
    // Show player card with animation
    playerDisplay.classList.remove('hidden');
    
    // Add entrance animation for player card
    const cardContainer = document.querySelector('.card-container');
    if (cardContainer) {
        cardContainer.style.animation = 'none';
        cardContainer.offsetHeight; // Trigger reflow
        cardContainer.style.animation = 'cardEntrance 1.2s ease-out forwards';
    }
    
    // Setup card hover effect
    setupCardHoverEffect();
    
    // Animate in the stats boxes with GSAP if available
    if (window.gsap) {
        gsap.from('.stat-box', {
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power2.out',
            delay: 0.8
        });
        
        // Animate in the context text
        gsap.from('.player-context', {
            y: 20,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out',
            delay: 1.2
        });
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
    // Find all elements that need animation reset
    const elements = [
        { selector: '.cell-logo', animation: 'logoEntrance 1.5s ease-out' },
        { selector: '.title-animated', animation: 'titleEntrance 1.5s ease-out 0.3s forwards' },
        { selector: '.subtitle-animated', animation: 'subtitleEntrance 1.5s ease-out 0.6s forwards' },
        { selector: '.event-info', animation: 'subtitleEntrance 1.5s ease-out 0.9s forwards' }
    ];
    
    // Reset each animation
    elements.forEach(item => {
        const element = document.querySelector(item.selector);
        if (element) {
            element.style.animation = 'none';
            element.offsetHeight; // Trigger reflow
            element.style.animation = item.animation;
        }
    });
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

// Mock function to simulate a team bidding (for demo purposes)
function addTeamBid(teamCode, teamName) {
    const teamChip = document.createElement('div');
    teamChip.className = 'team-chip';
    teamChip.innerHTML = `
        <img src="team-logos/${teamCode}.png" class="team-chip-logo" alt="${teamName}">
        <span class="team-chip-text">${teamName}</span>
    `;
    
    biddingTeamsElement.appendChild(teamChip);
}

// Countdown timer function
function startCountdown(durationInSeconds = 120) {
    let timeLeft = durationInSeconds;
    
    const timer = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timer);
            auctionTimerElement.textContent = "00:00";
            return;
        }
        
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        
        auctionTimerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        timeLeft--;
    }, 1000);
    
    // Return timer reference in case you need to cancel it
    return timer;
}

// Enhanced confetti animation function - Blue theme
function launchConfetti() {
    const duration = 8 * 1000;
    const animationEnd = Date.now() + duration;
    
    // Blue and white color scheme with accent colors
    const colors = [
        '#0080FF', // Cell blue
        '#00CCFF', // Light blue
        '#003366', // Dark blue
        '#66B2FF', // Baby blue
        '#FFFFFF', // White
        '#99CCFF'  // Light blue
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

// Initialize any needed functions when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Setup any initial state or listeners
    console.log('Display page loaded and ready');
});

// Add this new socket event handler to your display.js file

socket.on('show-player-unsold', (data) => {
    // Hide other screens
    hideAllScreens();
    
    // Update player name
    playerNameElement.textContent = data.playerName;
    
    // Show bid results screen
    bidResults.classList.remove('hidden');
    
    // Hide sold section, show unsold section
    document.getElementById('sold-section').classList.add('hidden');
    document.getElementById('unsold-section').classList.remove('hidden');
    
    // Animate elements with GSAP if available
    if (window.gsap) {
        gsap.fromTo('.result-player-name', 
            {y: -50, opacity: 0},
            {y: 0, opacity: 1, duration: 0.8, ease: 'power2.out'}
        );
        
        gsap.fromTo('.unsold-circle',
            {scale: 0, opacity: 0},
            {scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.7)'}
        );
        
        gsap.fromTo('.unsold-status',
            {y: 20, opacity: 0},
            {y: 0, opacity: 1, duration: 0.8, delay: 0.4, ease: 'power2.out'}
        );
        
        gsap.fromTo('.unsold-message',
            {y: 20, opacity: 0},
            {y: 0, opacity: 1, duration: 0.8, delay: 0.6, ease: 'power2.out'}
        );
        
        gsap.fromTo('.danger-badge',
            {opacity: 0},
            {opacity: 1, duration: 0.5, delay: 0.8, ease: 'power1.in'}
        );
    }
    
    // Create falling X particles animation
    createUnsoldAnimation();
});

// Add the following function to create the unsold animation
function createUnsoldAnimation() {
    const particleContainer = document.createElement('div');
    particleContainer.className = 'unsold-particles';
    document.body.appendChild(particleContainer);
    
    // Create regular particles
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random position and animation duration
        const posX = Math.random() * window.innerWidth;
        const size = Math.random() * 6 + 4; // 4-10px
        const delay = Math.random() * 2; // 0-2s delay
        const duration = Math.random() * 2 + 3; // 3-5s duration
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}px`;
        particle.style.animationDelay = `${delay}s`;
        particle.style.animationDuration = `${duration}s`;
        
        particleContainer.appendChild(particle);
    }
    
    // Create X mark particles (pairs of lines)
    for (let i = 0; i < 15; i++) {
        const leftLine = document.createElement('div');
        leftLine.className = 'particle cross-left';
        
        const rightLine = document.createElement('div');
        rightLine.className = 'particle cross-right';
        
        // Set position and animation for the X mark
        const posX = Math.random() * window.innerWidth;
        const delay = Math.random() * 3; // 0-3s delay
        const duration = Math.random() * 2 + 4; // 4-6s duration
        
        leftLine.style.left = `${posX}px`;
        leftLine.style.animationDelay = `${delay}s`;
        leftLine.style.animationDuration = `${duration}s`;
        
        rightLine.style.left = `${posX}px`;
        rightLine.style.animationDelay = `${delay}s`;
        rightLine.style.animationDuration = `${duration}s`;
        
        particleContainer.appendChild(leftLine);
        particleContainer.appendChild(rightLine);
    }
    
    // Remove particle container after animation completes
    setTimeout(() => {
        particleContainer.remove();
    }, 8000);
}

// Modify the existing show-bid-result handler to ensure proper section visibility
socket.on('show-bid-result', (data) => {
    // Hide other screens
    hideAllScreens();
    
    // Update bid results content
    playerNameElement.textContent = data.playerName;
    teamLogoElement.src = `team-logos/${data.teamImage}`;
    finalBidElement.textContent = `₹${data.finalBid} CR`;
    
    // Show bid results with sold section visible
    bidResults.classList.remove('hidden');
    document.getElementById('sold-section').classList.remove('hidden');
    document.getElementById('unsold-section').classList.add('hidden');
    
    // Add GSAP animations for bid result elements
    if (window.gsap) {
        animateBidResults();
    }
    
    // Trigger confetti
    launchConfetti();
});
