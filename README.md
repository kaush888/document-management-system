# Document Management System

A full-featured document management system built with NestJS, featuring user authentication, role-based access control, document storage, and embedding capabilities.

## Features

- **User Management**: Registration, authentication, and role-based authorization
- **Document Operations**: Upload, retrieve, update, and delete documents
- **Role-Based Access Control**: Admin, Editor, and Viewer roles with different permissions
- **Document Embeddings**: Generate and query document embeddings for semantic search
- **File Storage**: Local file storage with configurable paths
- **Database Integration**: PostgreSQL database with TypeORM
- **API Documentation**: Interactive API documentation using Swagger

## Technologies

- **Backend Framework**: NestJS
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT with Passport
- **Validation**: Zod and class-validator
- **File Handling**: Multer
- **API Documentation**: Swagger

## Project Setup

1. Clone the repository:

```bash
git clone <repository-url>
cd document-management-system
```

2. Install dependencies:

```bash
npm install
```

3. Environment Setup:

Create a `.env` file in the root directory from the `.env.example` file.

4. Database Migration:

```bash
# Run database migrations
npm run migration:run
```

## Running the Application

```bash
# Development mode
npm run start

# Watch mode (recommended for development)
npm run start:dev

# Production mode
npm run start:prod
```

## API Endpoints

### Authentication

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and receive JWT token

### Documents

- `POST /documents` - Create a new document (requires admin/editor role)
- `GET /documents` - Get all documents
- `GET /documents/:id` - Get a specific document
- `PATCH /documents/:id` - Update a document (requires admin/editor role)
- `DELETE /documents/:id` - Delete a document (requires admin/editor role)

### Embeddings

- `POST /embeddings/upload` - Upload a document for embedding
- `GET /embeddings/status/:id` - Check document ingestion status
- `GET /embeddings/search?query=<search_term>` - Search documents by semantic query

## Database Migrations

The application uses TypeORM migrations to manage database schema.

```bash
# Create a new migration
npm run migration:create --name=migration_name

# Generate a migration based on entity changes
npm run migration:generate --name=migration_name

# Run migrations
npm run migration:run

# Revert the latest migration
npm run migration:revert
```

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## API Documentation

The application provides interactive API documentation using Swagger UI.

### Accessing Swagger UI

Once the application is running, navigate to: [http://localhost:3000/api](http://localhost:3000/api)

## Project Structure

```directory
src/
├── auth/                # Authentication and authorization
├── config/              # Application configuration
├── documents/           # Document management
├── embeddings/          # Document embeddings
├── ingestion/           # Document ingestion
├── migrations/          # Database migrations
├── pipes/               # Custom validation pipes
├── users/               # User management
├── utils/               # Utility functions
├── app.module.ts        # Main application module
└── main.ts              # Application entry point
```

## License

This project is [MIT licensed](LICENSE).

