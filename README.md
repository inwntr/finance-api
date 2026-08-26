# My Finance API 💸

REST API for **Haon Finance**, a personal finance application for managing income, expenses, budgets, financial goals and monthly insights.

<p>
  <img src="https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Express-000000?logo=express&logoColor=white" alt="Express">
  <img src="https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white" alt="Prisma">
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black" alt="JavaScript">
</p>

- 🌐 [Live application](https://haonfinance.netlify.app)
- 🖥️ [Frontend source code](https://github.com/inwntr/finance)

---

## About

My Finance API provides authentication and financial management features for the Haon Finance web application.

Each user's financial data is isolated through authenticated and user-scoped database operations.

## Features

- User registration and authentication
- Password hashing with bcrypt
- JWT-protected routes
- Profile and avatar management
- Income and expense tracking
- Recurring expense management
- Expense payment status
- Monthly budgets
- Financial goals
- Dashboard summaries
- Monthly reports
- Financial charts and insights
- PostgreSQL persistence with Prisma ORM
- Cloudinary image storage
- Health and database status endpoint

## Tech Stack

| Area | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express |
| Database | PostgreSQL |
| ORM | Prisma |
| Authentication | JSON Web Token |
| Password hashing | bcrypt |
| File processing | Multer |
| Image storage | Cloudinary |
| Database hosting | Neon |
| API hosting | Vercel |

## Project Structure

```text
finance-api/
├── api/
│   └── index.js
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── routes/
│   └── server.js
├── package.json
├── prisma.config.ts
└── vercel.json
```

## Authentication

Protected routes expect a JWT in the `Authorization` header:

```http
Authorization: Bearer <access_token>
```

The token is created after a successful login and identifies the owner of each financial resource.

## API Endpoints

Base path:

```text
/api/v1
```

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/register` | Create an account |
| `POST` | `/auth/login` | Authenticate a user |

### User

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/user/me` | Validate the current session |
| `PATCH` | `/user/profile` | Update username or avatar |
| `PATCH` | `/user/password` | Change password |
| `DELETE` | `/user/account` | Delete the account |

### Incomes

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/incomes` | Create an income |
| `GET` | `/incomes` | List incomes |
| `PATCH` | `/incomes/:id` | Update an income |
| `DELETE` | `/incomes/:id` | Delete an income |

### Expenses

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/expenses` | Create an expense |
| `GET` | `/expenses` | List expenses |
| `PATCH` | `/expenses/:id` | Update an expense |
| `PATCH` | `/expenses/:id/pay` | Mark an expense as paid |
| `PATCH` | `/expenses/:id/pending` | Mark an expense as pending |
| `DELETE` | `/expenses/:id` | Delete an expense |

### Budgets and Goals

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/budgets` | Create or update a monthly budget |
| `GET` | `/budgets` | Get a monthly budget |
| `DELETE` | `/budgets` | Delete a monthly budget |
| `POST` | `/goals` | Create a financial goal |
| `GET` | `/goals` | List financial goals |
| `PUT` | `/goals/:id` | Update a financial goal |
| `DELETE` | `/goals/:id` | Delete a financial goal |

### Analytics

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/dashboard/summary` | Get a financial summary |
| `GET` | `/charts/financial-overview` | Get chart data |
| `GET` | `/reports/monthly` | Generate a monthly report |
| `GET` | `/insights` | Get financial insights |
| `GET` | `/status` | Check API and database health |

Several listing and analytics endpoints accept `month` and `year` as query parameters:

```http
GET /api/v1/reports/monthly?month=8&year=2026
```

## Running Locally

### Requirements

- Node.js
- npm
- PostgreSQL database
- Cloudinary account for avatar uploads

### Installation

```bash
git clone https://github.com/inwntr/finance-api.git
cd finance-api
npm install
```

Create a `.env` file in the project root:

```env
PORT=3000
DATABASE_URL="postgresql://user:password@localhost:5432/my_finance"
JWT_SECRET="replace-with-a-secure-random-secret"
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

Apply the database migrations:

```bash
npx prisma migrate dev
```

Start the development server:

```bash
npm run dev
```

The API will be available at:

```text
http://localhost:3000
```

## Security

The current implementation includes:

- Password hashing with bcrypt
- JWT authentication
- Authentication middleware for private routes
- User ownership checks for financial resources
- Restricted CORS origins
- Environment-based credentials
- Upload size limitation

Sensitive values must never be committed. Use `.env.example` to document required variables without exposing real credentials.

## Roadmap

- Request validation with Zod
- Authentication and upload rate limiting
- Image MIME-type validation
- Centralized error handling
- Automated integration tests
- OpenAPI/Swagger documentation
- Docker development environment
- Pagination for transaction endpoints
- Refresh-token and session revocation strategy

## Related Project

The frontend is available at:

- [My Finance Frontend](https://github.com/inwntr/finance)
- [Live Application](https://haonfinance.netlify.app)

## Author

Developed by [Winter](https://github.com/inwntr).
