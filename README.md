# Reliability-Aware AI Service Platform (RAASP)

RAASP is a production-ready full-stack application designed to provide AI-generated responses with integrated reliability metrics. It features a modular architecture, real-time confidence scoring, and comprehensive audit logging.

## 🏗 Architecture

The project follows a clean, modular architecture separating concerns between API handling, business logic, and data persistence.

### Backend (Express/Node.js)
- **API Layer**: RESTful endpoints for queries, health checks, and logs.
- **Service Layer**: 
  - `AIEngine`: Interfaces with Gemini AI (or mocks if no key provided).
  - `ReliabilityService`: Implements logic to determine response certainty.
- **Data Layer**: SQLite database for persistent logging.
- **Core**: Configuration management using Zod for validation.

### Frontend (React/Vite)
- **Components**: Atomic UI components (QueryForm, ResultCard).
- **Pages**: Main Home page orchestrating the user experience.
- **Services**: API client using Axios.
- **Styling**: Tailwind CSS for a professional, minimal interface.

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- Docker & Docker Compose (optional)

### Local Development
1. Install dependencies:
   ```bash
   npm install
   ```
2. Set up environment variables:
   ```bash
   cp .env.example .env
   # Add your GEMINI_API_KEY to .env
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.

### Docker Deployment
Build and run the entire stack using Docker Compose:
```bash
docker-compose up --build
```

## 📡 API Usage

### POST /api/query
Submits a question to the AI engine.
```json
{
  "question": "What is the capital of France?"
}
```

### GET /api/logs
Retrieves the last 100 interaction logs.

### GET /api/health
Returns system health status.

## 🧪 Reliability Logic
The platform determines reliability based on:
1. **Length Threshold**: Responses below 20 characters are flagged as "Uncertain".
2. **Confidence Score**: A probabilistic score (0-1). Scores below 0.5 are flagged as "Uncertain".

## 🛠 Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Lucide React, Framer Motion
- **Backend**: Express, TypeScript, Better-SQLite3, Zod
- **AI**: Google Gemini API
- **DevOps**: Docker, Docker Compose
