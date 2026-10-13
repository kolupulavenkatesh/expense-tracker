# Expense Tracker REST API Documentation

The Expense Tracker API exposes RESTful endpoints for managing personal expenses, querying transactional records with filters, and calculating dashboard summaries.

**Base URL**: `/api` (or `http://localhost:8080/api`)

---

## Data Models

### Categories Enum
The system classifies expenses into one of the following 8 categories:
- `FOOD`
- `TRANSPORT`
- `SHOPPING`
- `BILLS`
- `ENTERTAINMENT`
- `HEALTH`
- `EDUCATION`
- `OTHER`

### Expense Request Schema
```json
{
  "title": "string (1-100 characters, required)",
  "amount": "number (decimal >= 0.01, required)",
  "category": "string (enum, required)",
  "expenseDate": "string (YYYY-MM-DD, required)",
  "description": "string (max 500 characters, optional)"
}
```

### Expense Response Schema
```json
{
  "id": 1,
  "title": "Grocery Shopping",
  "amount": 75.50,
  "category": "FOOD",
  "expenseDate": "2026-10-05",
  "description": "Weekly grocery essentials",
  "createdAt": "2026-10-05T14:30:00",
  "updatedAt": "2026-10-05T14:30:00"
}
```

### Summary Response Schema
```json
{
  "totalAmount": 1250.75,
  "expenseCount": 24,
  "currentMonthTotal": 430.50,
  "categoryBreakdown": {
    "FOOD": 450.00,
    "TRANSPORT": 120.50,
    "SHOPPING": 210.00,
    "BILLS": 350.25,
    "ENTERTAINMENT": 80.00,
    "HEALTH": 40.00,
    "EDUCATION": 0.00,
    "OTHER": 0.00
  }
}
```

### Uniform Error Response Schema
```json
{
  "timestamp": "2026-10-05T14:30:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed for one or more fields",
  "path": "/api/expenses",
  "fieldErrors": {
    "title": "Title is required",
    "amount": "Amount must be greater than 0"
  }
}
```

---

## Endpoints

### 1. Get Categories
Returns the list of all available expense categories.

- **Method**: `GET`
- **Path**: `/api/categories`
- **Response**: `200 OK`
```json
[
  "FOOD",
  "TRANSPORT",
  "SHOPPING",
  "BILLS",
  "ENTERTAINMENT",
  "HEALTH",
  "EDUCATION",
  "OTHER"
]
```

**cURL Example**:
```bash
curl -X GET http://localhost:8080/api/categories
```

---

### 2. Create Expense
Creates and persists a new expense entry.

- **Method**: `POST`
- **Path**: `/api/expenses`
- **Content-Type**: `application/json`
- **Request Body**:
```json
{
  "title": "Lunch with Team",
  "amount": 25.50,
  "category": "FOOD",
  "expenseDate": "2026-10-05",
  "description": "Quick lunch at bistro"
}
```
- **Responses**:
  - `201 Created`: Returns newly created `ExpenseResponse`.
  - `400 Bad Request`: Validation failure (empty title, negative amount, etc.).

**cURL Example**:
```bash
curl -X POST http://localhost:8080/api/expenses \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Lunch with Team",
    "amount": 25.50,
    "category": "FOOD",
    "expenseDate": "2026-10-05",
    "description": "Quick lunch at bistro"
  }'
```

---

### 3. List Expenses (Search & Filter)
Retrieves expense records sorted by `expenseDate DESC, id DESC`. Supports optional search term, category filter, and date boundaries.

- **Method**: `GET`
- **Path**: `/api/expenses`
- **Query Parameters**:
  - `search` (optional): Case-insensitive match on title or description.
  - `category` (optional): Category enum filter (`FOOD`, `TRANSPORT`, etc.).
  - `from` (optional, `YYYY-MM-DD`): Beginning of date range (inclusive).
  - `to` (optional, `YYYY-MM-DD`): End of date range (inclusive).
- **Response**: `200 OK` (JSON array of `ExpenseResponse`)

**cURL Examples**:
```bash
# Get all expenses
curl -X GET http://localhost:8080/api/expenses

# Filter by category and search keyword
curl -X GET "http://localhost:8080/api/expenses?category=FOOD&search=lun"

# Filter by date range
curl -X GET "http://localhost:8080/api/expenses?from=2026-10-01&to=2026-10-31"
```

---

### 4. Get Expense by ID
Fetches a single expense record by its primary key.

- **Method**: `GET`
- **Path**: `/api/expenses/{id}`
- **Responses**:
  - `200 OK`: Returns the matching `ExpenseResponse`.
  - `404 Not Found`: If no expense exists with the given ID.

**cURL Example**:
```bash
curl -X GET http://localhost:8080/api/expenses/1
```

---

### 5. Update Expense
Updates an existing expense record.

- **Method**: `PUT`
- **Path**: `/api/expenses/{id}`
- **Content-Type**: `application/json`
- **Request Body**: Same as Create Expense.
- **Responses**:
  - `200 OK`: Returns updated `ExpenseResponse`.
  - `400 Bad Request`: Validation failure.
  - `404 Not Found`: If the record is not found.

**cURL Example**:
```bash
curl -X PUT http://localhost:8080/api/expenses/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Team Dinner",
    "amount": 48.00,
    "category": "FOOD",
    "expenseDate": "2026-10-05",
    "description": "Updated dinner bill"
  }'
```

---

### 6. Delete Expense
Deletes an existing expense record permanently.

- **Method**: `DELETE`
- **Path**: `/api/expenses/{id}`
- **Responses**:
  - `204 No Content`: Successful deletion.
  - `404 Not Found`: If no expense exists with the specified ID.

**cURL Example**:
```bash
curl -X DELETE http://localhost:8080/api/expenses/1
```

---

### 7. Get Expense Summary & Analytics
Retrieves total spent, total count, spending in the current calendar month, and per-category distributions.

- **Method**: `GET`
- **Path**: `/api/expenses/summary`
- **Query Parameters**:
  - `from` (optional): Filter start date.
  - `to` (optional): Filter end date.
- **Response**: `200 OK` (returns `SummaryResponse`)

**cURL Example**:
```bash
curl -X GET "http://localhost:8080/api/expenses/summary"
```
