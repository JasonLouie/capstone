# PokéGuesser 🎮

![MERN Stack](https://img.shields.io/badge/MERN-Stack-000000?style=for-the-badge&logo=mongodb&logoColor=green)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)

**PokéGuesser** is a full-stack, responsive web application that challenges users to identify Pokémon based on stats, types, and visual clues.

Built with the **MERN Stack** (MongoDB, Express, React, Node.js), this project demonstrates a production-ready architecture featuring secure authentication, optimistic UI updates, complex state management, and optimized data caching.

🔗 **Live Demo:** [https://pokeguesser-frontend.onrender.com/]

🔗 **Backend (API):** [https://pokeguesser-backend.onrender.com/]

---

## 🏗 Architecture Overview

This repository uses a monorepo structure containing both the client and server applications.

```text
root/
├── backend/    # RESTful API (Node.js/Express)
└── frontend/   # Client Application (React/Vite)
```

## 🔌 Backend (/backend)
A robust REST API handling business logic, user sessions, and game state persistence.

- Authentication: Uses Passport.js with a dual-strategy approach:

  - Local Strategy: For initial login.

  - JWT Strategy: Stored in secure, HttpOnly cookies for protected routes.

- Security: Implements bcrypt for password hashing, CORS policies, and sanitized inputs via custom validation middleware.

- Database: MongoDB (via Mongoose) with optimized indexing for fast lookups.

## 💻 Frontend (/frontend)
A fast, responsive interface built with React.

- Performance: Caches all 1,000+ Pokémon locally to allow for zero-latency guessing and validation.

- State Management: Powered by Zustand. Uses middleware to handle complex game saves and sync logic (local storage for guests vs. database for users).

- Styling: Pure CSS for a layout that adapts to any device without utility libraries.

## 🚀 Getting Started
To run this project locally, you will need to set up both the backend and frontend servers.

### Prerequisites
- Node.js (v14+)

- MongoDB (Local or Atlas)

1. Clone the Repository

```bash
git clone [https://github.com/your-username/pokeguesser.git](https://github.com/your-username/pokeguesser.git)
cd pokeguesser
```

2. Backend Setup
Navigate to the backend folder, install dependencies, and start the server.

```bash
cd backend
npm install
```
Configuration: Create a .env file in /backend:

```.env
ATLAS_URI=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_secret_key
REFRESH_TOKEN_SECRET=your_refresh_key
CLIENT_URL=http://localhost:5173
```
Start Server:

```bash
npm run dev
```

3. Frontend Setup
Open a new terminal, navigate to the frontend folder, and start the client.

```bash
cd ../frontend
npm install
```
Configuration: Create a .env file in /frontend:

```.env
VITE_API_URL=http://localhost:8080/api
```
Start Client:

```bash
npm run dev
```
Visit http://localhost:5173 (or the port Vite assigns) to play!

## ✨ Key Features
- Dual Game Modes: Play classic image guessing or hard-mode silhouettes.

- Progressive Persistence:

  - Guests: Play purely in the browser (LocalStorage).

  - Users: Log in to sync stats to the cloud.

- Smart Hints: Feedback on Generation (Higher/Lower), Types, and physical stats.

- Shiny Hunting: 1/4096 chance to unlock Shiny sprites in your Pokédex.

- Secure Auth: Protection against XSS using HttpOnly cookies for token storage.

## ⚖️ Legal Disclaimer
This is a non-profit, fan-made project created for educational and portfolio purposes.

Pokémon and Pokémon character names are trademarks of Nintendo. No copyright infringement is intended. All assets (sprites, names) are property of their respective owners. The dataset was retrieved using [PokéApi](https://pokeapi.co/).

## 👨‍💻 Author
Jason Louie

Note: This README.md file was mostly generated using AI and all descriptions accurately describe the application. All code is original.