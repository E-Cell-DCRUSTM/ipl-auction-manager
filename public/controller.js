// Connect to WebSocket server
const socket = io();

// Elements
const cardSearchInput = document.getElementById('card-search');
const clearSearchBtn = document.getElementById('clear-search');
const searchResultsDiv = document.getElementById('search-results');
const currentCardDiv = document.getElementById('current-card');
const playerNameInput = document.getElementById('player-name-input');
const teamSelectElement = document.getElementById('team-select');
const bidInputElement = document.getElementById('bid-input');
const showPlayerBtn = document.getElementById('show-player-btn');
const showResultBtn = document.getElementById('show-result-btn');
const showWelcomeBtn = document.getElementById('show-welcome-btn');
const connectionIndicator = document.getElementById('connection-indicator');
const connectionText = document.getElementById('connection-text');
const toast = document.getElementById('toast');
const toastIcon = document.getElementById('toast-icon');
const toastMessage = document.getElementById('toast-message');

// Currently selected card
let selectedCard = null;

// Fetch available card files from the server
function fetchAvailableCards() {
    fetch('/api/player-cards')
        .then(response => response.json())
        .then(cards => {
            // Store card data globally
            window.availableCards = cards;
            showToast('success', 'Player cards loaded successfully');
        })
        .catch(error => {
            console.error('Error fetching card data:', error);
            showToast('error', 'Failed to load player cards');
        });
}

// Clear search button
clearSearchBtn.addEventListener('click', () => {
    cardSearchInput.value = '';
    searchResultsDiv.innerHTML = '';
    searchResultsDiv.classList.remove('active');
});

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
    
    // Show toast notification
    showToast('info', `Selected: ${readableName}`);
}

// Toast notification function
function showToast(type, message) {
    // Set icon based on type
    switch(type) {
        case 'success':
            toastIcon.className = 'fas fa-check-circle';
            toastIcon.style.color = '#4caf50';
            break;
        case 'error':
            toastIcon.className = 'fas fa-exclamation-circle';
            toastIcon.style.color = '#f44336';
            break;
        case 'info':
            toastIcon.className = 'fas fa-info-circle';
            toastIcon.style.color = '#2196f3';
            break;
        case 'warning':
            toastIcon.className = 'fas fa-exclamation-triangle';
            toastIcon.style.color = '#ff9800';
            break;
    }
    
    // Set message
    toastMessage.textContent = message;
    
    // Show toast
    toast.classList.remove('hidden');
    
    // Hide toast after 3 seconds
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

// Button Actions
showPlayerBtn.addEventListener('click', () => {
    if (!selectedCard) {
        showToast('warning', 'Please select a player card first');
        return;
    }
    
    socket.emit('show-player', {
        cardFilename: selectedCard,
        playerName: playerNameInput.value
    });
    
    showToast('success', 'Showing player card on display');
});

showResultBtn.addEventListener('click', () => {
    if (!selectedCard) {
        showToast('warning', 'Please select a player card first');
        return;
    }
    
    const playerName = playerNameInput.value;
    const team = teamSelectElement.value;
    const finalBid = bidInputElement.value;
    
    if (!playerName) {
        showToast('warning', 'Please enter the player name');
        return;
    }
    
    if (!team) {
        showToast('warning', 'Please select a team');
        return;
    }
    
    if (!finalBid || finalBid <= 0) {
        showToast('warning', 'Please enter a valid bid amount');
        return;
    }
    
    socket.emit('show-bid-result', {
        playerName: playerName,
        teamImage: `${team}.png`,
        finalBid: finalBid
    });
    
    showToast('success', `Showing bid result: ${playerName} - ₹${finalBid} Cr`);
});

showWelcomeBtn.addEventListener('click', () => {
    socket.emit('show-welcome');
    showToast('info', 'Showing welcome screen');
});

// Unsold button
const markUnsoldBtn = document.getElementById('mark-unsold-btn');

markUnsoldBtn.addEventListener('click', () => {
    if (!selectedCard) {
        showToast('warning', 'Please select a player card first');
        return;
    }
    
    const playerName = playerNameInput.value;
    
    if (!playerName) {
        showToast('warning', 'Please enter the player name');
        return;
    }
    
    // Ask for confirmation
    if (confirm(`Mark ${playerName} as UNSOLD?`)) {
        socket.emit('show-player-unsold', {
            playerName: playerName,
            cardFilename: selectedCard
        });
        
        showToast('info', `${playerName} marked as UNSOLD`);
    }
});

// Initialize
fetchAvailableCards();

// WebSocket connection status
socket.on('connect', () => {
    console.log('Connected to server');
    connectionIndicator.classList.remove('offline');
    connectionIndicator.classList.add('online');
    connectionText.textContent = 'Connected';
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
    connectionIndicator.classList.remove('online');
    connectionIndicator.classList.add('offline');
    connectionText.textContent = 'Disconnected';
    showToast('error', 'Disconnected from server');
});
