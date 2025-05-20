# 🏏 IPL Auction System 🏆

A real-time IPL auction management system with controller and display interfaces. Built with E-Cell design philosophy featuring a modern blue theme and interactive elements.

## ✨ Features

- 🎮 **Dual-Interface System**: Controller for admins and display for audience
- ⚡ **Real-time Updates**: Socket.IO powered bidding and result announcements
- 🎯 **Interactive UI**: Animations, transitions, and 3D effects
- 🔍 **Player Search**: Easy card selection with search functionality
- 🎉 **Celebration Effects**: Confetti animations for successful bids
- 📱 **Responsive Design**: Works on all device sizes
- 🔄 **Live Connection Status**: Know when your controller is connected

## 🚀 Getting Started

### Prerequisites

- Node.js (v14+ recommended)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/E-Cell-DCRUSTM/ipl-auction-manager.git

# Navigate to the directory
cd ipl-auction-system

# Install dependencies
npm install

# Start the server
node server.js
```

Once running, access:
- Display: http://localhost:3000
- Controller: http://localhost:3000/controller

## 📁 Project Structure

```
ipl-auction-system/
│
├── server.js                # Express server & Socket.IO setup
│
├── package.json             # Project dependencies
│
└── public/                  # Static files
    ├── index.html           # Display interface HTML
    ├── controller.html      # Controller interface HTML
    ├── styles.css           # Display styles
    ├── controller-styles.css # Controller styles
    ├── display.js           # Display logic
    ├── controller.js        # Controller logic
    ├── cards/               # Player card images
    ├── team-logos/          # IPL team logos
    └── assets/              # Other assets like E-Cell logo
```

## 🔧 How It Works

1. **Controller Interface**:
   - Search and select player cards
   - Show selected player for auction on display
   - Record winning team and bid amount
   - Control which screen is shown on display

2. **Display Interface**:
   - Welcome screen with E-Cell branding
   - Player auction screen showing selected player card
   - Bid results screen with team logo and final bid amount

3. **Communication**:
   - Real-time bidding updates via Socket.IO
   - Status indicators for connection health

## 💫 Special Features

- **3D Card Effects**: Interactive spotlight and rotation effects on player cards
- **Animated Transitions**: Smooth transitions between different screens
- **Confetti Celebrations**: Visual celebration for successful bids
- **Toast Notifications**: User feedback in the controller interface
- **Search Functionality**: Quick player selection with search

## 🎨 E-Cell Design Elements

- Cell blue (#0080FF) as primary color theme
- Modern gradients and lighting effects
- Interactive UI elements with subtle animations
- Responsive and clean interface

## 🛠️ Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express
- **Real-time Communication**: Socket.IO
- **Animations**: GSAP, CSS Animations
- **Effects**: Canvas Confetti

Made with 🚀 by [Shiven Saini](mailto:shiven.career@proton.me)
