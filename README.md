# Crypto Marketplace

Crypto Marketplace is a comprehensive platform for visualizing and trading cryptocurrency data. It provides real-time data visualization, historical data analysis, and live trade updates from multiple cryptocurrency exchanges. The platform is built using modern web technologies and offers a user-friendly interface for both novice and experienced traders.

## Features

- **Real-time Data Visualization**: View real-time cryptocurrency data with interactive charts.
- **Historical Data Analysis**: Analyze historical data with customizable timeframes.
- **Live Trade Updates**: Get live updates on trades from multiple exchanges.
- **Multi-Exchange Support**: Supports Binance, Bybit, Mexc, and Kucoin exchanges.
- **Responsive Design**: Optimized for both desktop and mobile devices.

## Technologies Used

- **Frontend**: React, Tailwind CSS, WebSockets
- **Backend**: Node.js, Express, Axios
- **WebSocket Server**: Reconnecting WebSocket
- **Data Visualization**: ApexCharts

## Getting Started

### Prerequisites

Make sure you have the following installed on your machine:

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Chittaranjans/Crypto-marketplace.git
   cd Crypto-marketplace

2. Install dependencies for both the frontend and backend:

    ```bash
# Install backend dependencies
cd Backend
npm install

# Install frontend dependencies
cd ../Frontend
npm install

3. Running the Server

   ```bash
   cd Backend
   npm start

The backend server will run on http://localhost:3001.

   cd ../socket
   node spot.js

The WebSocket server will run on ws://localhost:8080.

  cd ../Frontend
  npm start



4. Usage
# Open your browser and navigate to your Frontend server (http://localhost:(PORT))
# Select the desired exchange, market, and symbol from the dropdown menus.
# View real-time data, historical data, and live trade updates.

5. Project Structure
# Backend: Contains the backend server code for fetching data from exchanges.
# Frontend: Contains the React frontend code for the user interface.
# socket: Contains the WebSocket server code for real-time data updates.

6. Contributing
   ```bash
## We welcome contributions from the community. To contribute, please follow these steps:

# Fork the repository.
# Create a new branch (git checkout -b feature-branch).
# Make your changes and commit them (git commit -m 'Add new feature').
# Push to the branch (git push origin feature-branch).
# Create a pull request.
