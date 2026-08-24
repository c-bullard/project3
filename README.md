# fullstack-scaffold

A minimal fullstack starter using npm workspaces: a React + Vite client and an Express + PostgreSQL server.

## Structure

```
client/   React app
server/   Express API
```

## Setup

```bash
npm install
```

## Development

Run both client and server together:

```bash
npm run dev
```

Or run them individually:

```bash
npm run dev:client   # Vite dev server
npm run dev:server   # Express server with nodemon
```

## Scripts

| Script               | Description                        |
| -------------------- | ---------------------------------- |
| `npm run dev`        | Run client and server concurrently |
| `npm run dev:client` | Run only the client                |
| `npm run dev:server` | Run only the server                |
