# Deployable Multi-Service Blog Application

This repository contains the implementation of a multi-service blog platform using Docker and AWS. The platform includes the following services: User, Blog, Comment, and Database.

## Table of Contents
- [Objective](#objective)
- [Services Overview](#services-overview)
  - [User Service](#user-service)
  - [Blog Service](#blog-service)
  - [Comment Service](#comment-service)
- [System Architecture](#system-architecture)
- [Project Requirements](#project-requirements)
- [Setup and Deployment Instructions](#setup-and-deployment-instructions)
  - [Local Development](#local-development)
  - [AWS Deployment](#aws-deployment)
- [API Documentation](#api-documentation)
- [Testing Instructions](#testing-instructions)
- [Design Decisions](#design-decisions)
- [Environment Variables](#environment-variables)

---

## Objective
The goal of this project is to develop and deploy a scalable, containerized multi-service application that demonstrates skills in backend development, container orchestration, and cloud deployment.

---

## Services Overview

### 1. User Service
- **Description**: Handles user authentication and profile management.
- **Features**:
  - Authentication with JWT.
  - Secure password hashing using `bcrypt`.
- **Endpoints**:
  - `POST /register/`: Register a new user.
  - `POST /login/`: Authenticate a user.
  - `GET /users/<id>`: Retrieve user details.
  - `PUT /users/<id>`: Edit user details.
  - `DELETE /users/<id>`: Delete user.
- **Port**: Accessible at `http://localhost:3000`.

### 2. Blog Service
- **Description**: Manages blog posts with pagination for scalability.
- **Features**:
  - CRUD operations for blog posts.
  - Built-in pagination.
- **Endpoints**:
  - `POST /blogs/`: Create a new blog post.
  - `GET /blogs/<id>`: Fetch a specific blog post.
  - `PUT /blogs/<id>`: Edit a blog post.
  - `DELETE /blogs/<id>`: Delete a blog post.
- **Port**: Accessible at `http://localhost:3001`.

### 3. Comment Service
- **Description**: Manages comments for blog posts.
- **Features**:
  - Flat structure for comments (extensible for nested comments).
- **Endpoints**:
  - `POST /comments/`: Add a comment.
  - `GET /comments?blogId=<id>`: List comments for a specific blog post.
- **Port**: Accessible at `http://localhost:3002`.

### 4. Database Service
- **Description**: Centralized PostgreSQL database with separate schemas for each service.

---

## System Architecture

The architecture consists of four services communicating over Docker networks. Each service is containerized with a separate Dockerfile, and orchestration is managed using `docker-compose.yml`. The application is deployed on an AWS EC2 instance with PostgreSQL as the database backend.

---

## Project Requirements

1. **Dockerization**:
   - Separate Dockerfiles for each service with multi-stage builds.
   - `docker-compose.yml` for orchestration.
2. **AWS Deployment**:
   - EC2 instance running Docker containers.
   - Persistent data storage using AWS RDS (PostgreSQL).
3. **Environment Management**:
   - Separate `.env` files for local and production environments.

---

## Setup and Deployment Instructions

### Local Development

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd <repo-directory>
   ```
2. Set up `.env` files for each service in their respective directories.
3. Build and start services:
   ```bash
   docker-compose up --build
   ```
4. Access the services at the following ports:
   - User Service: `http://localhost:3000`
   - Blog Service: `http://localhost:3001`
   - Comment Service: `http://localhost:3002`

### AWS Deployment

1. Launch an EC2 instance and SSH into it.
2. Install Docker and Docker Compose:
   ```bash
   sudo apt update
   sudo apt install docker.io docker-compose
   ```
3. Transfer project files to the EC2 instance.
4. Set up `.env` files for production in the EC2 instance.
5. Run the application:
   ```bash
   docker-compose up --build -d
   ```
6. Access the services at the following ports:
   - User Service: `http://<EC2-IP>:3000`
   - Blog Service: `http://<EC2-IP>:3001`
   - Comment Service: `http://<EC2-IP>:3002`

---

## API Documentation

Here are examples of how to use all API endpoints in the project. For endpoints that require authentication, include the JWT token in the request header as follows:

```
Authorization: Bearer <your-jwt-token>
```

### User Service (Port 3000)
- **Register a User**:
  ```
  POST http://localhost:3000/register
  Body: {
    "username": "testuser",
    "password": "securepassword"
  }
  ```
- **Login**:
  ```
  POST http://localhost:3000/login
  Body: {
    "username": "testuser",
    "password": "securepassword"
  }
  ```
- **Get User Details** (Requires JWT Token):
  ```
  GET http://localhost:3000/users/1
  Headers: {
    "Authorization": "Bearer <your-jwt-token>"
  }
  ```
- **Edit User Details** (Requires JWT Token):
  ```
  PUT http://localhost:3000/users/1
  Headers: {
    "Authorization": "Bearer <your-jwt-token>"
  }
  Body: {
    "username": "updateduser"
  }
  ```
- **Delete User** (Requires JWT Token):
  ```
  DELETE http://localhost:3000/users/1
  Headers: {
    "Authorization": "Bearer <your-jwt-token>"
  }
  ```

### Blog Service (Port 3001)
- **Create a Blog Post** (Requires JWT Token):
  ```
  POST http://localhost:3001/blogs
  Headers: {
    "Authorization": "Bearer <your-jwt-token>"
  }
  Body: {
    "title": "My First Blog",
    "content": "This is the content of my first blog."
  }
  ```
- **Fetch a Specific Blog**:
  ```
  GET http://localhost:3001/blogs/1
  ```
- **Edit a Blog Post** (Requires JWT Token):
  ```
  PUT http://localhost:3001/blogs/1
  Headers: {
    "Authorization": "Bearer <your-jwt-token>"
  }
  Body: {
    "title": "Updated Blog Title",
    "content": "Updated blog content."
  }
  ```
- **Delete a Blog Post** (Requires JWT Token):
  ```
  DELETE http://localhost:3001/blogs/1
  Headers: {
    "Authorization": "Bearer <your-jwt-token>"
  }
  ```

### Comment Service (Port 3002)
- **Add a Comment** (Requires JWT Token):
  ```
  POST http://localhost:3002/comments
  Headers: {
    "Authorization": "Bearer <your-jwt-token>"
  }
  Body: {
    "blogId": 1,
    "content": "This is a comment on the blog post."
  }
  ```
- **List Comments for a Blog Post**:
  ```
  GET http://localhost:3002/comments?blogId=1
  ```

---

## Testing Instructions

Since this is a backend project without a frontend, use tools like [Postman](https://www.postman.com/) or cURL to test the API endpoints. Refer to the [API Documentation](#api-documentation) for endpoint examples.

---

## Design Decisions

- **JWT for Authentication**: Provides secure and stateless user authentication.
- **PostgreSQL**: Chosen for its robustness and scalability.
- **Docker Networks**: Used for seamless inter-service communication.

---

## Environment Variables

Create `.env` files for local and production environments. Example:

```env
DATABASE_URL=postgres://<user>:<password>@<host>:<port>/<db>
JWT_SECRET=<your-secret-key>
```

---

## Disclaimer

Ensure that all required databases and schemas are created before running the application. For this project, databases were created using Neon Console for PostgreSQL along with the required schemas and SQL setup.

---

For any issues or queries, feel free to raise an issue in this repository.

