# PokéGuesser - Backend

This is the backend for my PokéGuesser web application. Note: the 1,025 entries of pokémon seed data are NOT included in the repository at all. However, the functions to retrieve the entries (one by one) from PokéApi can be found in the [frontend](https://github.com/JasonLouie/capstone/tree/main/frontend/).

## Base URL

The game's backend was deployed using render. Access the link [here](https://pokeguesser-backend.onrender.com/). Note: All endpoints are prefixed with `/api`.

## Getting Started: Backend Server

This is the backend API for the application, built with Node.js, Express, and MongoDB. It utilizes ES Modules and includes authentication via Passport (JWT & Local).

### Prerequisites

Ensure you have the following installed on your local machine:
* [Node.js](https://nodejs.org/) (v14+ recommended)
* [MongoDB](https://www.mongodb.com/) (Local instance or Atlas URI)

    ```bash
    npm install -g nodemon
    ```

### Installation

1.  **Clone the repository** (if you haven't already):
    ```bash
    git clone <repository-url>
    cd backend
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

### Configuration (.env)

Create a `.env` file in the root directory. Based on the dependencies (`mongoose`, `jsonwebtoken`, `cors`), the configuration should look like this:

```env
# Server Configuration

# Database
ATLAS_URI=mongodb://localhost:27017/your_database_name

# Authentication Secrets (JWT)
ACCESS_TOKEN_SECRET=your_super_secret_access_key
REFRESH_TOKEN_SECRET=your_super_secret_refresh_key

# CORS Settings (Frontend URL)
CLIENT_URL=http://localhost:5173 (Depends on what port the frontend is hosted on)
```
Note: Since `cookie-parser` is used, ensure your secrets are strong to secure the HttpOnly cookies.

### Running the Server
The project uses `cross-env` to handle environment variables across different operating systems.

#### Development Mode
Runs the server with nodemon for hot-reloading.

```bash
npm run dev
```

- Command executes: `cross-env NODE_ENV=development nodemon index.js`

#### Production Mode
Runs the server using standard Node.

```bash
npm start
```
- Command executes: `cross-env NODE_ENV=production node index.js`

### Project Structure Notes
- Type: This project uses `"type": "module"`. Ensure you use ES6 import/export syntax instead of require.

- Database: Mongoose is used for Object Data Modeling (ODM).

- Auth: Authentication is handled via passport strategies (Local for login, JWT for protected routes).

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

## Custom Middleware

The backend relies on a suite of custom middleware functions to handle logging, authentication, input validation, and centralized error management.

### Global & Utility Middleware

These functions handle the request lifecycle and operational logging.

| Middleware | File | Description |
| :--- | :--- | :--- |
| `logRequest` | `requestLogger.js` | Logs the HTTP method, endpoint URL, and timestamp (en-US format) for every incoming request to the console. |
| `handleServerErrors` | `errorHandler.js` | **Centralized Error Handler.** Intercepts errors passed via `next(err)`. It automatically parses Mongoose errors (Validation, Duplicate Key, CastError) into user-friendly messages and formats them into a standardized JSON response. |

### Authentication Middleware

Wrappers around **Passport.js** strategies to handle session security and specific error messages.

| Middleware | File | Description |
| :--- | :--- | :--- |
| `authenticateUser` | `userAuth.js` | **Strategy: Local.** Used during login. Verifies email/password. Returns `401` for invalid credentials or `500` for server errors. |
| `protect` | `userAuth.js` | **Strategy: JWT.** Used to protect private routes. Decodes the Access Token from cookies. It explicitly handles `TokenExpiredError`, `MissingTokenError`, and `InvalidTokenError` with specific 401 responses. |

### Validation Middleware
The project uses a custom, schema-based validation engine (`validators.js`) to sanitize inputs before they reach the controllers. If validation fails, it returns a `400 Bad Request` with an object containing specific error messages for each invalid field.

**Auth Validators:**
* `validateSignUp`: Checks username format, email regex, and ensures `password` matches `confirmPassword`.
* `validateLogin`: Enforces required email and password fields.
* `validatePassword`: Validates complexity requirements (1 Uppercase, 1 Lowercase, 1 Number, No Whitespace) when changing passwords.
* `validateModifyUser` & `validateEmail`: Validation for profile updates.

**Game Logic Validators:**
* `validateGuess`: Ensures the guess contains a valid Pokémon ID (1-1025), a valid `version`, and a valid game `mode`.
* `validateGameSettings`: Validates the settings object (e.g., ensuring `generations` array has max 9 items and `mode` is either "regular" or "silhouette").
* `validateUpdateGame`: Enforces valid `gameState` enum values ("playing", "won", "lost").

---

## Error Response Structure

All errors returned by the API (whether from Validation, Authentication, or the Database) follow a strict `EndpointError` class structure. This ensures the frontend always knows how to parse error messages.

### Standard Error Format
```json
{
  "status": 400,
  "message": {
    "field_name": ["Specific error message for this field"]
  },
  "name": "EndpointError" // or specific error name like "TokenExpiredError"
}
```

### Specific Handling

The `handleServerErrors` middleware automatically translates technical Mongoose errors into readable messages:

- Duplicate Data (Code 11000): Converts "E11000 duplicate key error..." into `{"email": ["Email is taken"]}`.

- Cast Errors: Converts invalid ObjectId failures into `{"id": "Invalid user id."}`.

- Validation Errors: Collects all failures from a Mongoose schema validation and returns them in a single response object.

### Automatic Name Mapping
If a specific error name is not provided, the class automatically assigns a standard name based on the HTTP status code:

- 400: BadRequest

- 401: Unauthorized

- 403: Forbidden

- 404: NotFound

- 409: Conflict

- 500: ServerError

### Message Formatting Logic
The class contains internal logic to format concise messages:

- Complex Objects: If an object is passed (e.g., Validation Errors), it is returned as-is.

- Single Word Strings: If a single word is passed combined with specific status codes, it auto-formats the message.

  - Example: new EndpointError(404, "User") → Response: "User not found."

- Full Strings: If a full sentence is passed, it is returned as-is.

### Error Handling Middleware (`errorHandler.js`)
The global error handler utilizes EndpointError to translate technical Mongoose errors into this standard format:

- Validation Errors: Converted to a 400 BadRequest with a key-value object of field constraints.

- Duplicate Key (E11000): Converted to a 400 BadRequest with a user-friendly "Field is taken" message.

- JWT/Auth Errors: Converted to 401 Unauthorized with names like TokenExpiredError or MissingTokenError.

Note: This README file was mostly generated with AI, but the actual code, functionality, and design are all mine.