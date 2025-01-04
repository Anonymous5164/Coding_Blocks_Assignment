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
  - `GET /blogs/`: List all blog posts.
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
  - `GET /comments?post_id=<id>`: List comments for a specific blog post.
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

## Testing Instructions

Since this is a backend project without a frontend, use tools like [Postman](https://www.postman.com/) or cURL to test the API endpoints. For example:

1. Open Postman.
2. Create a new request and set the method (e.g., POST, GET).
3. Enter the endpoint URL:
   - User Service: `http://localhost:3000/<endpoint>`
   - Blog Service: `http://localhost:3001/<endpoint>`
   - Comment Service: `http://localhost:3002/<endpoint>`
4. Add necessary headers and body data.
5. Send the request and verify the response.

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

For any issues or queries, feel free to raise an issue in this repository.

