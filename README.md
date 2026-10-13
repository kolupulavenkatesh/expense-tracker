# Expense Tracker - Full-Stack Web Application

A complete, production-ready full-stack Expense Tracker built with **Java 21**, **Spring Boot 3.3.5**, **MySQL 8.0**, and **React 18 + TypeScript 5 (Vite 5)** with a responsive plain-CSS design system.

---

## Tech Stack

- **Backend**:
  - Java 21 (Eclipse Temurin)
  - Spring Boot 3.3.5
  - Spring Web & Spring Data JPA
  - Jakarta Bean Validation
  - Flyway Database Migrations
  - MySQL Connector / J
  - Maven & Maven Wrapper
- **Database**:
  - MySQL 8.0 (persistent docker volume or local install)
  - H2 Database (in-memory MySQL mode for tests)
- **Frontend**:
  - React 18, TypeScript 5, Vite 5
  - Axios 1.x with centralized API service
  - React Router DOM v6
  - Modern Plain CSS (CSS Variables, Flexbox/Grid, Dark mode, zero external UI libraries)
  - Lucide React icons
- **Testing**:
  - Backend: JUnit 5, Mockito, Spring MockMvc, `@DataJpaTest` on H2
  - Frontend: Vitest, React Testing Library, jsdom
- **Containerization**:
  - Multi-stage Dockerfiles for backend and frontend
  - Docker Compose orchestration with automated healthchecks

---

## Prerequisites

Ensure the following tools are installed on your machine:
- **Java**: JDK 21 or higher (`java -version`)
- **Node.js**: Node 20 or higher & npm (`node -v`, `npm -v`)
- **Docker Desktop**: Docker and Docker Compose (if running with containers)
- **Maven**: (Optional, as the project includes the Maven Wrapper `./mvnw` / `mvnw.cmd`)

---

## Getting Started: Three Run Options

### Option A: Everything in Docker (Full Containerization)
Run the complete stack (MySQL, Spring Boot backend, and Nginx-served React frontend) with a single command:

1. Copy the environment variables:
   ```bash
   cp .env.example .env
   # On Windows PowerShell:
   # Copy-Item .env.example .env
   ```

2. Build and launch all services:
   ```bash
   docker compose up --build
   ```

3. Open your browser:
   - **Frontend Application**: [http://localhost:3000](http://localhost:3000)
   - **Backend API**: [http://localhost:8080/api](http://localhost:8080/api)

---

### Option B: Dev Mode (Docker MySQL + Local Dev Servers)
Run MySQL inside Docker while running Spring Boot and Vite with live hot-reloading:

1. Start the MySQL database container:
   ```bash
   docker compose up -d mysql
   ```

2. Launch the Spring Boot backend:
   ```bash
   cd backend
   ./mvnw spring-boot:run
   # On Windows:
   # .\mvnw.cmd spring-boot:run
   ```
   *The backend starts at `http://localhost:8080` and Flyway applies migrations automatically.*

3. Launch the React frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   *The frontend dev server starts at `http://localhost:5173` with proxying configured to `:8080`.*

---

### Option C: Using an Existing Local MySQL Server
If you already have MySQL installed and running locally on your system:

1. Create the database and user in your MySQL shell:
   ```sql
   CREATE DATABASE expense_tracker;
   CREATE USER 'expense_user'@'localhost' IDENTIFIED BY 'expense_pass';
   GRANT ALL PRIVILEGES ON expense_tracker.* TO 'expense_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

2. Export the database environment variables:
   ```bash
   # On macOS/Linux:
   export DB_URL="jdbc:mysql://localhost:3306/expense_tracker?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC"
   export DB_USER="expense_user"
   export DB_PASSWORD="expense_pass"

   # On Windows PowerShell:
   $env:DB_URL="jdbc:mysql://localhost:3306/expense_tracker?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC"
   $env:DB_USER="expense_user"
   $env:DB_PASSWORD="expense_pass"
   ```

3. Run the backend and frontend:
   ```bash
   # Terminal 1: Backend
   cd backend && ./mvnw spring-boot:run

   # Terminal 2: Frontend
   cd frontend && npm install && npm run dev
   ```

---

## Running Tests

Both backend and frontend have comprehensive automated test suites that run independently without any external database:

### Backend Tests (JUnit 5, Mockito, MockMvc, H2)
Runs all unit and integration tests using an isolated H2 in-memory database:
```bash
cd backend
./mvnw test
# On Windows:
# .\mvnw.cmd test
```
- **Service Tests**: Mockito tests covering `create`, `update`, `delete`, and `not-found` scenarios.
- **Controller Tests**: `@WebMvcTest` validating 201 Created on valid input, 400 Bad Request with field errors on invalid input, and 404 on missing entities.
- **Repository Tests**: `@DataJpaTest` verifying dynamic search, category filtering, date ranges, and summary aggregations.

### Frontend Tests & Type Checking (Vitest & Vite)
```bash
cd frontend
npm test          # Runs Vitest unit tests
npm run build     # Runs TypeScript verification and production build
```
- Verifies that `ExpenseForm` displays required field errors when submitted empty and prevents zero/negative amounts.

---

## REST API Overview

| Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/expenses` | Add a new expense record | `201 Created` |
| `GET` | `/api/expenses` | List expenses (optional `search`, `category`, `from`, `to`) | `200 OK` |
| `GET` | `/api/expenses/{id}` | Retrieve expense details by ID | `200 OK` / `404` |
| `PUT` | `/api/expenses/{id}` | Update an existing expense record | `200 OK` / `404` |
| `DELETE` | `/api/expenses/{id}` | Delete an expense record | `204 No Content` / `404` |
| `GET` | `/api/expenses/summary` | Dashboard metrics (total, count, month, category breakdown) | `200 OK` |
| `GET` | `/api/categories` | List available category names | `200 OK` |

*For complete API schemas and curl examples, see [docs/API.md](docs/API.md).*

---

## Troubleshooting

### 1. Port 3306 is already in use
If you have a local MySQL or MariaDB instance occupying port `3306`:
- Change the mapped port in `.env`:
  ```env
  MYSQL_PORT=3307
  ```
- Or stop the local MySQL service before starting Docker:
  - Windows: `Stop-Service MySQL80` or `net stop mysql`
  - Linux: `sudo systemctl stop mysql`
  - macOS: `brew services stop mysql`

### 2. Docker Daemon is not running
If running `docker compose` fails with `Cannot connect to the Docker daemon`:
- Launch **Docker Desktop** and wait until the status indicator displays green ("Engine running").
- Alternatively, use **Option C** to run with a local MySQL server and run the apps directly.

### 3. Cross-Origin Resource Sharing (CORS) Issues
The backend reads allowed origins from `app.cors.allowed-origins` configured in `application.properties` (defaults to `http://localhost:5173,http://localhost:3000`). If hosting under a custom origin, update the `CORS_ALLOWED_ORIGINS` environment variable.

### 4. Database Connection Refused on Startup
When using Docker Compose, the backend service uses a health check condition (`depends_on: mysql: condition: service_healthy`) to wait until MySQL is fully initialized and accepting connections before starting. If running locally, verify MySQL is running on `localhost:3306`.
