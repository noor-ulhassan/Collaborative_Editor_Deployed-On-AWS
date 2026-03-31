# Collaborative Code Editor

A real-time collaborative code editor built using the MERN stack (MongoDB, Express, React, Node.js) with WebSockets and CRDTs for seamless multi-user editing. This project leverages Yjs and Monaco Editor to provide a powerful, conflict-free collaborative coding environment.

## Features

- **Real-time Collaboration**: Multiple users can edit the same document concurrently.
- **Conflict Resolution**: Powered by Yjs (CRDT - Conflict-free Replicated Data Type) to ensure consistency across all clients without synchronization conflicts.
- **Monaco Editor Integration**: Features a rich code editor experience similar to VS Code.
- **WebSocket Communication**: Uses Socket.io for low-latency, real-time bidirectional communication.
- **Docker Support**: Containerized for easy deployment and scaling.

## Technology Stack

### Frontend
- **React 19** with **Vite**
- **Tailwind CSS v4** for styling
- **Monaco Editor** (`@monaco-editor/react`)
- **Yjs** & **y-monaco** for real-time syncing
- **Socket.io Client** (`y-socket.io`)

### Backend
- **Node.js** with **Express.js**
- **Socket.io** (`socket.io`, `y-socket.io`)

## Local Development

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd Collaborative-Editor
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   npm run dev
   ```
   The backend will start and listen for WebSocket connections.

3. **Frontend Setup:**
   In a new terminal:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   The frontend will be accessible at the URL provided by Vite (typically http://localhost:5173).

## Docker Deployment

This project includes a `Dockerfile` for easy containerization. 

To build and run the Docker image:

```bash
docker build -t collaborative-editor .
docker run -p 3000:3000 collaborative-editor
```
*(Adjust the ports as necessary based on your Dockerfile configuration)*

## License

This project is open-source and available under the [ISC License](LICENSE).
