# Playroom

A responsive browser arcade with eight games and no application dependencies.

## Run

Requires Node.js 22 or newer. From this directory:

```sh
npm start
```

The HTTP server listens on `0.0.0.0:3000`. Set `PORT` to use another port. `npm run dev` restarts the server on source changes. Run the server and rules integration tests with `npm test`.

## Games

- Online two-player Tic-Tac-Toe, Connect Four, and Rock Paper Scissors
- Solo Snake (keyboard and touch controls), Memory Match, Quick Reflex, Minesweeper, and Target Rush

For multiplayer, create a room, share its six-character code, and have a friend join from the same deployed site. The server validates moves and streams updates using Server-Sent Events. Rock Paper Scissors choices stay hidden until both players submit. Players can play rematches and track scores within their room.

## Hosting

Deploy this directory to a host that runs a persistent Node.js HTTP service. Use `npm start` as the start command; no build command or dependency installation is necessary. Configure the host's reverse proxy to allow streaming `/api/events` responses without buffering. Use HTTPS for the public site.

This is a single-server implementation: rooms and scores are stored in memory, disappear on restart, and idle rooms expire after 24 hours. Use one server instance; shared durable room storage and production abuse controls would be needed before scaling to multiple instances. No accounts, credentials, or database are required. Public deployment is separate from running in the development environment.

Typography uses optional Google Fonts with local sans-serif fallbacks; gameplay has no external service dependencies.
