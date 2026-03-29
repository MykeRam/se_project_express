# WTWR (What to Wear?) Back End

## Project Description

This project is the back-end server for the WTWR application. It provides a REST API for working with users and clothing items, stores data in MongoDB, and handles request validation and error responses.

The server supports creating and retrieving users, creating and retrieving clothing items, deleting clothing items, and liking or unliking items. It also includes temporary authorization middleware so item ownership and likes can be associated with a user during development.

## Functionality

- `GET /users` returns all users
- `GET /users/:userId` returns a user by ID
- `POST /users` creates a new user
- `GET /items` returns all clothing items
- `POST /items` creates a new clothing item
- `DELETE /items/:itemId` deletes a clothing item by ID
- `PUT /items/:itemId/likes` likes a clothing item
- `DELETE /items/:itemId/likes` removes a like from a clothing item

## Technologies and Techniques Used

- Node.js for the server runtime
- Express.js for routing and HTTP request handling
- MongoDB for data storage
- Mongoose for schemas, models, validation, and database queries
- Validator for URL validation in schema fields
- ESLint with `airbnb-base` and Prettier-compatible configuration for code quality
- Nodemon for hot reload during development
- Modular project structure with separated `routes`, `controllers`, `models`, and `utils`
- Centralized error-code constants and request error handling with JSON responses

## Running the Project

- `npm run start` starts the server on `localhost:3001`
- `npm run dev` starts the server on `localhost:3001` with hot reload
- `npm run lint` runs ESLint

## Images / Screenshots

### Fetching All Users

![Fetching all users](./images/get-users.png)

### Fetching Clothing Items

![Fetching clothing items](./images/get-items.png)

### Creating a Clothing Item

![Creating a clothing item](./images/post-item.png)

### Liking an Item

![Liking an item](./images/like-item.png)

### Error Response

![API error response](./images/error-response.png)

## Video Demo

A video demo link can be added here to walk through the API routes and project structure.
