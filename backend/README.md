# PokéGuesser - Backend

This is the backend for my PokéGuesser web application.

## Base URL

The game's backend was deployed using render. Access the link [here](https://pokeguesser-backend.onrender.com/). Note: All endpoints are prefixed with `/api`.

## Authentication & Sessions

The application uses HttpOnly cookies (Access Token & Refresh Token) to manage user sessions.

- Protected Routes: All user routes and game routes require a valid authentication cookie. Some of the auth routes require a valid authentication cookie (resetting password or email). The pokemon route does not require any authentication.

- Guest Logic: Guest users may be handled via temporary tokens or distinct logic, but authenticated endpoints assume a valid userId is extractable from the request context.

## Database Models & Schemas

The application uses **MongoDB** with **Mongoose** for object modeling. The database architecture separates authentication credentials (`Auth`) from user profiles (`User`) to maintain a clean separation of concerns.

### Auth Model

**Collection:** `auth`
**Description:** Handles secure login credentials. The `_id` of this document serves as the foreign key link to the `User` profile.

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `email` | String | Yes | Unique email address. Validated via regex and a custom async validator to check availability. Stored in lowercase. |
| `password` | String | Yes | Hashed password. **Pre-save hook:** Automatically hashes the password using `bcrypt` (12 rounds) if modified. |
| `version` | Number | No | Optimistic concurrency control key. |

**Methods:**
* `comparePassword(comparedPassword)`: Asynchronously compares a plaintext password with the hashed password stored in the database.

### User Model
**Collection:** `users`
**Description:** Stores public user profile data, settings, and game history.
**Relationship:** `_id` is manually set to match the `Auth` document's `_id`, creating a strict 1-to-1 relationship.

| Field | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Yes | - | References `Auth` model ID. |
| `username` | String | Yes | - | Unique display name. Validation allows alphanumeric, underscores, and periods. |
| `profilePicUrl`| String | No | `""` | URL string to the user's avatar. |
| `pokedex` | Array | No | `[]` | List of `pokedexEntrySchema` objects (caught Pokemon). |
| `settings` | Object | No | `{}` | User preference configuration (`settingsSchema`). |

#### Sub-Schemas

**Settings Schema:**
* `mode`: Enum (`"regular"`, `"silhouette"`). Defaults to `"regular"`.
* `generations`: Array of strings. Limits user to specific generations. Max length 9.
* `allGenerations`: Boolean. Defaults to `true`.

**Pokedex Entry Schema:**
* `id`: Number (Pokémon ID).
* `isShiny`: Boolean (Default `false`).
* `time_added`: Date.

#### Virtuals & Aggregation
The User model utilizes a **Post-Find Middleware** to dynamically calculate game statistics without storing them permanently in the User document.
* `gamesPlayed`: (Virtual) Count of games where `gameState` is not "playing".
* `totalGuesses`: (Virtual) Sum of all guesses made across all games.
* **Performance Note:** This middleware performs an aggregation on the `Game` collection every time a User is queried.

### Game Model

**Collection:** `games`

**Description:** Represents a single instance of a game played by a user.

**Indexes:** Timestamps are enabled (`createdAt`, `updatedAt`).

| Field | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `userId` | ObjectId | Yes | - | Reference to the `User` who owns the game. |
| `gameState` | String | No | `"playing"` | Enum: `"playing"`, `"won"`, `"lost"`. |
| `answer` | Number | No | `null` | The ID of the target Pokémon to guess. |
| `guesses` | Array | No | `[]` | Array of numbers representing IDs of Pokémon guessed so far. |
| `settings` | Object | No | `{}` | Snapshot of the `settingsSchema` used for this specific game instance. |

### Pokemon Model

**Collection:** `pokemon`

**Description:** Static data collection containing Pokémon information.

**Key Constraints:** `_id` is explicitly set to the Pokémon's national dex number.

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `_id` | Number | Yes | National Dex ID (1-1025). |
| `name` | String | Yes | Pokémon name. |
| `img` | String | Yes | URL to the sprite image. |
| `types` | Array | Yes | Array of exactly two type strings (e.g., `["Fire", "None"]`). |
| `generation` | String | No | The region/generation of origin (e.g., "Kanto"). |
| `color` | String | Yes | Primary color category. |
| `stage` | Number | Yes | Evolutionary stage (integer >= 1). |
| `height` | Number | Yes | Height value. |
| `weight` | Number | Yes | Weight value. |

### Refresh Token Model

**Collection:** `refresh_tokens`

**Description:** Manages long-lived authentication sessions.

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `refreshToken` | String | Yes | The actual token string. |
| `userId` | ObjectId | Yes | Reference to the `User` owning the token. |
| `createdAt` | Date | No | **TTL Index:** Automatically deletes the document 7 days after creation. |

## Endpoints

### Authentication Endpoints

Operations related to account creation, access, and deletion.

| Method | Endpoint | Body Parameters | Description |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/signup` | `email`, `password`, `username` | Registers a new user and sets `accessToken` and `refreshToken` cookies. |
| **POST** | `/api/auth/login` | `email`, `password` | Authenticates a user and sets `accessToken` and `refreshToken` cookies. |
| **POST** | `/api/auth/logout` | N/A | Clears authentication cookies and ends the session. |
| **DELETE** | `/api/auth/delete` | N/A | **Irreversible.** Deletes the user's account and all associated data from the database. |
| **POST** | `/api/auth/email` | `newEmail`, `password` | Updates the user's email address. Requires current password for verification. |
| **POST** | `/api/auth/password` | `oldPassword`, `newPassword` | Updates the user's password. |

### User Profile & Settings Endpoints

Operations for managing user profile data, pokédex history, and game preferences.

| Method | Endpoint | Body/Params | Description |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/users/me` | N/A | Retrieves current user profile data (also used to verify if user is logged in). |
| **PATCH** | `/api/users/me` | `username`, `profilePicture` | Updates specific profile fields like display name or avatar. At the moment, avatar modification is not implemented. |
| **DELETE** | `/api/users/me/pokedex` | N/A | Resets the user's "caught" or "seen" history (Pokédex). |
| **PATCH** | `/api/users/me/settings` | `allGenerations` (bool), `mode` (obj) | Updates basic global settings, such as toggling all generations or switching game modes. |
| **POST** | `/api/users/me/settings/generations/add` | `generation` (id/obj) | Adds a specific Pokémon generation to the user's active filter. |
| **DELETE** | `/api/users/me/settings/generations/:generation` | URL Param: `generation` | Removes a specific generation from the user's active filter. |

### Game Endpoints

Endpoints for managing the active game state. Note: Users can only have one active game state per mode (one for 'regular', one for 'silhouette'). Game saves are identified by the composite of userId, mode, and version. Past games cannot be accessed unless the user wants to continue viewing their current game stats. Once the user starts a new game of the same mode, they can no longer view the guesses of that previous game.

| Method | Endpoint | Body Parameters | Description |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/games/me` | `settings` (includes `mode`) | **Get or Resume:** Checks for an existing active game for the specified mode. If none exists, creates one. |
| **POST** | `/api/games/me/new` | `settings`, `answerId` | **Force New Game:** Overwrites any existing game state for the current mode and starts a fresh game with a new answer. |
| **PUT** | `/api/games/me` | `gameState` (e.g., `won`, `lost`) | Updates the status of the current game (e.g., flagging the game as finished). |
| **POST** | `/api/games/me/guesses` | `guess` (id), `version`, `mode` | Submits a Pokémon guess. Backend validates the guess and updates the game state. |
| **PUT** | `/api/games/me/answer` | `answer` (id), `version`, `mode` | Updates the target "Answer" Pokémon for the current game. |

### Pokémon Data Endpoints

Endpoints for retrieving or managing the static Pokémon data used by the application.

| Method | Endpoint | Body Parameters | Description |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/pokemon` | N/A | Retrieves the list of all available Pokémon data. |
| **POST** | `/api/pokemon` | `pokemon` (object/array) | Adds new Pokémon data to the database. |