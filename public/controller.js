// Connect to WebSocket server
const socket = io();

// Elements
const cardSearchInput = document.getElementById('card-search');
const searchResultsDiv = document.getElementById('search-results');
const currentCardDiv = document.getElementById('current-card');
const playerNameInput = document.getElementById('player-name-input');
const teamSelectElement = document.getElementById('team-select');
const bidInputElement = document.getElementById('bid-input');
const showPlayerBtn = document.getElementById('show-player-btn');
const showResultBtn = document.getElementById('show-result-btn');
const showWelcomeBtn = document.getElementById('show-welcome-btn');

// Currently selected card
let selectedCard = null;

// Fetch available card files from the server
function fetchAvailableCards() {
    fetch('/api/player-cards')
        .then(response => response.json())
        .then(cards => {
            // Store card data globally
            window.availableCards = cards;
        })
        .catch(error => {
            console.error('Error fetching card data:', error);
        });
}

// Search functionality
cardSearchInput.addEventListener('input', () => {
    const searchTerm = cardSearchInput.value.trim().toLowerCase();
    
    // Clear previous results
    searchResultsDiv.innerHTML = '';
    
    if (!searchTerm || !window.availableCards) {
        searchResultsDiv.classList.remove('active');
        return;
    }
    
    // Filter cards based on search term
    const matchingCards = window.availableCards.filter(card => 
        card.toLowerCase().includes(searchTerm)
    );
    
    if (matchingCards.length > 0) {
        searchResultsDiv.classList.add('active');
        
        // Add matching cards to search results
        matchingCards.forEach(card => {
            const searchItem = document.createElement('div');
            searchItem.className = 'search-item';
            
            // Convert filename to readable name (e.g., "Virat-Kohli.jpg" -> "Virat Kohli")
            const readableName = card
                .replace(/\.[^.]+$/, '') // Remove file extension
                .replace(/-/g, ' ');     // Replace hyphens with spaces
            
            searchItem.textContent = readableName;
            searchItem.addEventListener('click', () => selectCard(card, readableName));
            
            searchResultsDiv.appendChild(searchItem);
        });
    } else {
        searchResultsDiv.classList.remove('active');
    }
});

// Hide search results when clicking outside
document.addEventListener('click', (event) => {
    if (!searchResultsDiv.contains(event.target) && event.target !== cardSearchInput) {
        searchResultsDiv.classList.remove('active');
    }
});

// Select a card
function selectCard(cardFilename, readableName) {
    selectedCard = cardFilename;
    searchResultsDiv.classList.remove('active');
    
    // Update card preview
    currentCardDiv.innerHTML = `
        <img src="cards/${cardFilename}" alt="${readableName}">
        <p>${readableName}</p>
    `;
    
    // Set the player name in the result section
    playerNameInput.value = readableName;
    
    cardSearchInput.value = readableName;
}

// Button Actions
showPlayerBtn.addEventListener('click', () => {
    if (!selectedCard) {
        alert('Please select a player card first');
        return;
    }
    
    socket.emit('show-player', {
        cardFilename: selectedCard,
        playerName: playerNameInput.value
    });
});

showResultBtn.addEventListener('click', () => {
    if (!selectedCard) {
        alert('Please select a player card first');
        return;
    }
    
    const playerName = playerNameInput.value;
    const team = teamSelectElement.value;
    const finalBid = bidInputElement.value;
    
    if (!playerName) {
        alert('Please enter the player name');
        return;
    }
    
    if (!team) {
        alert('Please select a team');
        return;
    }
    
    if (!finalBid || finalBid <= 0) {
        alert('Please enter a valid bid amount');
        return;
    }
    
    socket.emit('show-bid-result', {
        playerName: playerName,
        teamImage: `${team}.png`,
        finalBid: finalBid
    });
});

showWelcomeBtn.addEventListener('click', () => {
    socket.emit('show-welcome');
});

// Initialize
fetchAvailableCards();

// WebSocket connection status
socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
});
