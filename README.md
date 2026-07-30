# Realtime Voting App

A realtime voting application with a React + Vite frontend and a Node.js backend that stores polls and broadcasts live vote updates. Designed for quick setup and local development so you can create polls, vote, and see updates in realtime.

---

## Features
- Create polls with multiple options
- Cast votes and see live updates across connected clients
- REST endpoints for poll CRUD operations
- WebSocket-based realtime updates (client and server components present)

---

## Tech stack
- Languages: JavaScript, CSS, HTML
- Frontend: React + Vite (single-page app)
- Backend: Node.js (Express-style routes present)
- Realtime: WebSocket integration (client socket file present)
- Data: Server-side model file indicates a database-backed Poll model (typical usage: MongoDB + Mongoose)

---

## Repository structure (top-level)
```
client/              # React + Vite frontend
  index.html
  package.json
  vite.config.js
  src/
    main.jsx
    App.jsx
    socket.js        # client-side socket helper
    index.css
    components/
      Navbar.jsx
      PollCard.jsx
      *.css
    pages/
      Homepage.jsx
      Createpage.jsx
      *.css
  public/

server/              # Node.js backend
  index.js           # server entrypoint
  package.json
  db.js               # database connection helper
  routes/
    poll.js          # poll REST endpoints
  models/
    Poll.js          # Poll model
```

Files used to build this README were taken from the repository root and the client and server subdirectories (notably the client/src and server/* files listed above).

---

## Quickstart — run locally

Prerequisites
- Node.js (v16+ recommended) and npm
- A running database if the server uses one (the server includes a db helper and a Poll model; set up a MongoDB instance or the DB your project expects)

1) Install and start the server
```bash
cd server
npm install
# If package.json defines a start script:
npm start
# Otherwise:
node index.js
```

2) Install and start the client
```bash
cd client
npm install
npm run dev
```

Open the client URL shown by Vite (usually http://localhost:5173) and the server port shown by the server log (commonly http://localhost:3000 or configured via env).

---

## Environment variables (example)
Create a `.env` file in the `server/` folder (and `client/` if applicable). Example values — update to match your environment:
```
# server/.env
PORT=3000
MONGO_URI=mongodb://localhost:27017/realtime-voting
CLIENT_URL=http://localhost:5173
```

Notes:
- The server includes `db.js` and `models/Poll.js`, so it expects a database connection string.
- If the server uses other keys (API keys, auth secrets), add them as needed.

---

## API & realtime (what to expect)
- REST routes are implemented in `server/routes/poll.js`. Typical endpoints in that file usually include:
  - Create poll
  - Get polls / get poll by id
  - Vote on poll
  - Delete poll (if implemented)

- Realtime updates:
  - Client socket helper: `client/src/socket.js`
  - When votes are cast, the server broadcasts updates to connected clients so vote tallies update without refreshing.

Open `server/routes/poll.js` and `client/src/socket.js` to see the exact event names and route paths.

---

## Development notes
- Frontend:
  - Uses Vite for dev server and build.
  - Entry point: `client/src/main.jsx`. Main application component:`client/src/App.jsx`.
  - UI components live under `client/src/components/` and pages under `client/src/pages/`.

- Backend:
  - Entrypoint: `server/index.js`
  - Database helper: `server/db.js`
  - Poll model: `server/models/Poll.js`
  - Routes: `server/routes/poll.js` — check this file for the exact REST API surface.

If you plan to run the server and client concurrently in development, run each in its own terminal. Optionally, use a process manager or add a root-level script to run both simultaneously.

---

## Troubleshooting
- If the client cannot receive realtime updates, confirm:
  - Server is running and reachable from client (CORS or client origin config)
  - WebSocket endpoint and event names match between `client/src/socket.js` and server implementation
- If the server fails to connect to DB, verify `MONGO_URI` (or equivalent) environment variable and that your DB is reachable.

---

## Contributing
- Open an issue for feature requests or bugs.
- Fork the repo, create a feature branch, and submit a pull request.
- Keep changes focused and include a brief description of what you changed and why.

---

## License
Add a license file (LICENSE) and choose a license (e.g., MIT) if you intend to open-source this project.

---

I looked through the repository layout (client/ and server/ folders and their key files: entry points, socket helper, routes, and model) and used those concrete files to create the setup, run, and structure sections above. If you want, I can:
- Generate a ready-to-commit README.md file formatted exactly for this repo,
- Draft example API documentation showing exact endpoints by opening server/routes/poll.js,
- Add a CONTRIBUTING.md or example .env.example file. Which would you like next?
