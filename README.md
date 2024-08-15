# Backend Test Case (PLEASE READ ME)

Using Express.js and MongoDB

## Features

- **Books**: Add, delete, list, and manage book inventory.
- **Members**: Add, delete, and manage library members.
- **Borrow & Return**: Allow members to borrow and return books, including penalty calculation for late returns.
- **Swagger API Documentation**: Detailed API documentation using Swagger.

## Requirements

- Node.js
- MongoDB
- npm (Node Package Manager)

## Installation

1. **Open root folder**
   ```bash
   cd library-case
   ```
2. **Install dependencies**
   
   ```bash
   npm install
   ```
3. **Environment Configuration**
   Create a .env file in the root of the project and configure environment variables:
   ```bash
   MONGO_URL="mongodb+srv://user:pass@cluster0.pjynhxq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
   PORT=5001
   ```
4. **Start the server**
   ```bash
   npm start
   ```
5. **(OPSIONAL) Unit Testing with Jest**
   ```bash
   npm test
   ```
   
## API Endpoints
The API provides the following endpoints:

   Books
   GET /books: Retrieve a list of all books.
   GET /books/available: Retrieve a list of available (unborrowed) books.
   POST /books: Add a new book.
   DELETE /books/{code}: Delete a book by code.
   POST /books/borrow: Borrow a book.
   POST /books/return: Return a borrowed book.
  
   Members
   GET /members: Retrieve a list of all members.
   POST /members: Add a new member.
   GET /members/{code}: Get details of a specific member.
   DELETE /members/{code}: Delete a member by code.
   
## API Documentation
The API documentation is generated using Swagger
   ```bash
   http://localhost:5001/api-docs
   ```
