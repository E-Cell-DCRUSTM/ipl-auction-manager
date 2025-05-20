const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/controller', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'controller.html'));
});

// API endpoint to get list of player card files
app.get('/api/player-cards', (req, res) => {
    const cardsDirectory = path.join(__dirname, 'public', 'cards');
    
    fs.readdir(cardsDirectory, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return res.status(500).json({ error: 'Error reading player cards directory' });
        }
        
        // Filter to only include image files
        const imageFiles = files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return ['.jpg', '.jpeg', '.png', '.gif'].includes(ext);
        });
        
        res.json(imageFiles);
    });
});

// Socket.io connection handler
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    
    socket.on('show-player', (data) => {
        io.emit('show-player', data);
        console.log(`Showing player: ${data.playerName}`);
    });
    
    socket.on('show-bid-result', (data) => {
        io.emit('show-bid-result', data);
        console.log(`Showing result for ${data.playerName}: ₹${data.finalBid} Cr to ${data.teamImage.split('.')[0]}`);
    });

    socket.on('show-player-unsold', (data) => {
        io.emit('show-player-unsold', data);
        console.log(`Player marked as unsold: ${data.playerName}`);
    });
    
    socket.on('show-welcome', () => {
        io.emit('show-welcome');
        console.log('Showing welcome screen');
    });
    
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Display: http://localhost:${PORT}`);
    console.log(`Controller: http://localhost:${PORT}/controller`);
});
