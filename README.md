# AI Personality Assessment System
[ Still in starting phase a lot more work will be added in future ]

Welcome to the **AI-Powered Personality Assessment System**, full-stack platform built to deliver intelligent, real-time personality assessments.

---

## Project Overview

This system provides:
* A dynamic landing page with animations  
* Secure, role-based login (candidates + recruiters)  
* Real-time AI-driven chat assessments  
* Live personality feedback + PDF export  
* Recruiter dashboards with aggregated analytics and charts  
* Fully responsive design with dark/light mode support

---

## Tech Stack

| Layer          | Technologies Used                                                                  |
|---------------|-------------------------------------------------------------------------------------|
| **Frontend**  | React, Material-UI (MUI), React Router, Framer Motion, Chart.js                    |
| **Backend**   | Flask, Flask-SQLAlchemy, Flask-Migrate, Flask-JWT-Extended, Redis, PostgreSQL      |
| **AI Layer**  | OpenRouter API (for GPT-based assessment logic)                                    |
| **Database**  | PostgreSQL (inside Docker)                                                         |
| **Caching**   | Redis (inside Docker)                                                              |
| **Containerization** | Docker, Docker Compose (for multi-service orchestration)                   |

---

## Engineering Best Practices

* **Asynchronous AI Calls:**  
The backend integrates OpenRouter’s GPT models **asynchronously using `httpx`**,  
ensuring the Flask server remains non-blocking even when waiting for LLM responses.

* **Role-Based Access Control (RBAC):**  
Using JWT tokens, the system separates recruiter and candidate flows, ensuring only authorized users can access dashboards or submit assessments.

* **Caching with Redis:**  
Assessment sessions, temporary data, and rate-limited states are stored in Redis for high-speed, scalable backend operations.

* **Database Migrations:**  
PostgreSQL schema changes are version-controlled and applied with Flask-Migrate,  
ensuring smooth upgrades across environments.

* **Componentized Frontend:**  
The React app uses MUI components, a global dark/light theme provider, animated transitions via Framer Motion,  
and responsive layouts — ensuring the UX is modern and internationally appealing.

* **Containerized Deployment:**  
The entire stack runs inside Docker Compose, making it cloud-ready and reproducible on any environment.

* **Separation of Concerns:**  
Backend and frontend are fully decoupled, communicating only through REST APIs,  
allowing independent scaling and development.

---

## Setup & Run

```bash
### 1 Clone the repository
git clone https://github.com/your-username/ai-personality-assessment.git
cd ai-personality-assessment

### 2 Run with docker
  docker-compose up --build
  This spins up:
    Flask backend at localhost:5000
    React frontend at localhost:3000
    PostgreSQL at localhost:5432
    Redis at localhost:6379


## Running Frontend and Backend Separately (Without Docker)

You can run the React frontend and Flask backend on your local machine using their native tools.  
Here’s how to do it step by step.

---

### Backend (Flask) Setup

1 Go to the backend folder:
cd backend

2️ (Optional) Create a virtual environment:
python -m venv venv
source venv/bin/activate   # on Linux/macOS
venv\Scripts\activate      # on Windows
3️ Install Python dependencies:
pip install -r requirements.txt
4️ Set up environment variables (example for Linux/macOS):
export FLASK_APP=run.py
export FLASK_ENV=development
export DATABASE_URL=postgresql://user:password@localhost/personality_db
export REDIS_URL=redis://localhost:6379/0
export OPENROUTER_API_KEY=sk-or-v1
5️ Run database migrations:
flask db upgrade
6️ Start the Flask server:
flask run
=> Backend will be running at:
http://localhost:5000

### Frontend (React) Setup
1️ Go to the frontend folder:
cd frontend
2️ Install Node.js dependencies:
npm install
3️ Start the React development server:
npm start

### Frontend will be running at:
http://localhost:3000
By default, React will proxy API calls to http://localhost:5000.

* Requirements
1. PostgreSQL running locally on localhost:5432
2. Redis running locally on localhost:6379
Use Docker to run them:
docker run -p 5432:5432 -e POSTGRES_USER=user -e POSTGRES_PASSWORD=password -e POSTGRES_DB=personality_db postgres
docker run -p 6379:6379 redis


