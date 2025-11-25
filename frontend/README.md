# Pokémon Guessing Game - Frontend

**Welcome to PokéGuesser!** Think you know your Pokémon? Prove it! Your goal is to find the mystery Pokémon using as few guesses as possible.

This is a fast, responsive, and persistent web application built with React. It challenges users to identify Pokémon using a "Wordle-like" hint system, featuring sophisticated state management that bridges local storage for guests and database synchronization for registered members. Interested in how the backend works? Click [here](https://github.com/JasonLouie/capstone/tree/main/backend) to read more about the backend.

## 🚀 Key Features

* **Smart Hint System:**
    * **Generation:** Tells you if the target Pokémon is from a higher, lower, or matching generation.
    * **Types:** Indicates if your guess shares a Primary or Secondary type with the answer (type order matters!).
    * **Stats:** Compares Height, Weight, Color, and Evolution Stage to guide your next guess.
* **Dual Game Modes:**
    * **Regular:** Guess the Pokémon with random guesses using the table for hints.
    * **Silhouette:** Visual challenge—guess based only on a blacked-out silhouette.
    * *Note:* Your Regular and Silhouette games are saved in separate slots, so you never lose progress in one mode while playing the other.
    * **State Isolation:** Each game remembers the settings selected at its start. You can have a "Gen 1 Only" game active in Regular mode while simultaneously playing an "All Generations" game in Silhouette mode.
* **Custom Responsive Design (Pure CSS):**
    * Built entirely with **Pure CSS** to adapt to most screen sizes.
    * Features a dynamic hamburger menu that automatically adjusts visibility based on device width.
* **Play Anywhere:**
    * **Guests:** Game state is saved directly to your browser's `localStorage` so you never lose your streak.
    * **Registered Users:** Log in to sync your stats across devices. Changes are applied instantly (Optimistic UI) while syncing asynchronously to the database.
* **Performance-First:** All 1,025 Pokémon are cached locally for instant validation and zero-latency gameplay.
* **Shiny Hunting:** Every correct guess has a **1/4096** chance of turning the Pokémon "Shiny" in your persistent Pokédex.

## 🎮 How to Play

1.  **Make a Guess:** Type in a Pokémon name to submit your first guess.
2.  **Analyze the Hints:** We provide feedback on how close you are:
    * **Generation:** Are you too early (Higher needed) or too late (Lower needed)?
    * **Types (1 & 2):** Does your guess share a type with the mystery Pokémon?
    * **Stats:** We compare **Height**, **Weight**, **Color**, and **Evolution Stage**.
3.  **Play Your Way:** Use the settings to select which **Regions (Generations)** you want to include in the pool.
4.  **Win:** Identify the mystery Pokémon to add it to your Pokédex!

## 🛠 Tech Stack

* **Framework:** React (Vite recommended)
* **State Management:** Zustand (with Middleware)
* **Search Engine:** Fuse.js (Fuzzy searching)
* **Styling:** Pure CSS (Custom Media Queries & Viewport Units)
* **Routing:** React Router (Protected Routes)

## 🏗 Architectural Highlights

### 1. State Management (Zustand)
We utilize **Zustand** combined with `zustand/middleware` to automate the persistence of complex states.
* **Automation:** Middleware handles the saving/loading of game data automatically.
* **Separation of Concerns:** State is divided into:
    * `useUserStore`: Handles auth, settings, and profile stats.
    * `useGameStore`: Handles current guesses, answers, and game status.
    * `usePokemonStore`: Manages the static Pokémon data cache.
* **Guest Storage:** To prevent data collisions, guest users utilize two separate storage keys in `localStorage`: one for **Regular** mode and one for **Silhouette** mode.

### 2. Fuzzy Search Optimization
We implement **Fuse.js** to allow users to search for Pokémon by name, showing up to 20 related results.
* **Hook:** `usePokemonSearch`
* **Optimization:** Leverages `useMemo` to initialize the 1,025-item index only once, preventing expensive recalculations during UI updates.
  * *Why?* Initializing the Fuse index with 1,025 objects is computationally expensive. `useMemo` ensures the index is built only once (or when the dataset changes) rather than on every render. Additionally, it memoizes search results to prevent recalculation during unrelated UI updates.

### 3. Game Lifecycle Logic
* **Resume:** Automatically loads existing sessions. If none exist, a new game is created.
* **New Game (Guests):** Simply overwrites the existing local save file for that mode to start fresh.
* **New Game (Registered Users):**
    * When a user finishes a game (Win or Loss) and starts a new one, the previous game is **archived** in the database rather than deleted.
    * **Statistical Tracking:** This preservation allows the backend to aggregate lifetime statistics, specifically **Total Guesses** made and **Games Played**.
    * *Note:* The "Games Played" count specifically excludes currently active sessions to provide an accurate reflection of completed matches.

## 🔒 Authentication & Protected Routes

While guests can play freely, registered users gain access to cloud persistence and profile management.
* **Guards:** Protected routes wrap specific pages to ensure only authenticated users can access:
    * Profile Stats (Win/Loss ratios, total guesses).
    * User Settings (Update Username/Email/Password).
    * Danger Zone (Reset Pokédex, Delete Account).

## 📂 Custom Hooks

* **`useDocumentTitle`**: Dynamically updates the document title based on the route or game state.
* **`usePokemonSearch`**: Encapsulates Fuse.js logic and memoized performance optimizations.

## 📦 Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone <your-repo-url>
    cd frontend
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Environment Variables**
    Create a `.env` file in the root directory:
    ```env
    VITE_BASE_URL=http://localhost:8080/api
    ```

4.  **Run Development Server**
    ```bash
    npm run dev
    ```

## ⚖️ Legal Disclaimer

This is a non-profit, fan-made project created for educational and portfolio purposes.

**Pokémon** and **Pokémon character names** are trademarks of **Nintendo**.
No copyright infringement is intended. All assets (sprites, names) are property of their respective owners.

## 🔮 Future Improvements

* **Leaderboards:** Global ranking system for registered users.
* **Daily Challenge:** A specific "Pokémon of the Day" that is the same for all users.
* **Visual Effects/Animations:** Visual cues for displaying new guesses and custom animations for incorrect/correct guesses. Visuals for successfully guessing the Pokémon and obtaining a shiny Pokémon.
* **Sound Effects:** Audio cues for correct/incorrect guesses and shiny encounters.