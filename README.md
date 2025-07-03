# DB-Connection

This repository contains two Node.js Express applications demonstrating different database connections:

1. MongoDB connection using Mongoose
2. PostgreSQL connection using Sequelize

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher) - for Mongoose project
- PostgreSQL (v12 or higher) - for Postgres project
- npm (Node Package Manager)

## Project Structure

```
DB-Connection/
├── via-Node-Exp-Mongoose/   # MongoDB with Mongoose project
└── via-Node-Exp-Postgres/   # PostgreSQL with Sequelize project
```

## Setup and Installation

### Common Steps for Both Projects

1. Clone the repository:

```bash
git clone <repository-url>
cd DB-Connection
```

### MongoDB with Mongoose Project

1. Navigate to the Mongoose project:

```bash
cd via-Node-Exp-Mongoose
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the project root with the following variables:

```env
PORT=3000
NODE_ENV=development
DB_NAME=your_database_name
HOST=localhost
COLLECTION_NAME=your_collection_name
```

### PostgreSQL with Sequelize Project

1. Navigate to the Postgres project:

```bash
cd via-Node-Exp-Postgres
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the project root with the following variables:

```env
PORT=3001
NODE_ENV=development
DB=your_database_name
DB_SCHEMA=project
DB_HOST=localhost
DB_PORT=5432
DB_USER_PGPLSQL=your_postgres_username
DB_PASSWORD=your_postgres_password

# Email configuration (optional - for email notifications)
USER_EMAIL_ID=your_email@gmail.com
USER_EMAIL_PASSWORD=your_email_app_password
```

## Running the Applications

### MongoDB with Mongoose Project

1. Start the server:

```bash
npm start
```

The server will start on http://localhost:3000 (or the PORT specified in .env)

### PostgreSQL with Sequelize Project

1. Start the server:

```bash
npm start
```

The server will start on http://localhost:3001 (or the PORT specified in .env)

## API Documentation

### MongoDB with Mongoose Project

The project includes Swagger documentation accessible at:

```
http://localhost:3000/api-docs
```

### Available Endpoints

Both projects implement similar REST API endpoints for product management:

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get a specific product
- `POST /api/products` - Create a new product
- `PUT /api/products/:id` - Update a product
- `DELETE /api/products/:id` - Delete a product

## Features

### MongoDB with Mongoose Project

- MongoDB database integration using Mongoose
- Swagger API documentation
- Winston logging
- Error handling middleware
- Product CRUD operations

### PostgreSQL with Sequelize Project

- PostgreSQL database integration using Sequelize
- Email notifications using Nodemailer
- Product CRUD operations
- Error handling middleware

## Development

Both projects use `nodemon` for development, which automatically restarts the server when file changes are detected.

## Error Handling

Both projects implement centralized error handling through middleware. Check the respective `middleware` directories for implementation details.

## Logging

The MongoDB project uses Winston for logging. Logs are stored in the `logs` directory.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Author

Sm Satheesh
