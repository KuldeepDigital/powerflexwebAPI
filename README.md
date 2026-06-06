# Powerflex Web API

A robust backend REST API built with Node.js, Express, and Microsoft SQL Server. This API serves both public content (products, blogs, careers) and provides a secure administrative backend for content management and user enquiry handling.

## Tech Stack
- **Node.js & Express.js**
- **Database:** Microsoft SQL Server (`mssql`)
- **Authentication:** JWT & bcrypt
- **File Uploads:** Multer
- **Email:** Nodemailer

## Getting Started

### Prerequisites
- Node.js
- Microsoft SQL Server
- `.env` file with database credentials and JWT secrets.

### Installation
1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```
   The server will start on `http://localhost:5000` (by default).

## Features
- **Public Endpoints:** Access products, categories, blogs, and submit contact/enquiry forms.
- **Admin Endpoints:** JWT-secured routes for managing products, categories, and viewing form submissions.
- **Static File Serving:** Product images and enquiry drawings are managed via the `/uploads` directory.
- **API Documentation:** Swagger UI is available at `/api-docs`. The documentation is automatically generated using `swagger-autogen`. Every time you start the server using `npm run dev` or `npm start`, the `swagger-output.json` file is refreshed automatically based on the routes and inline controller comments.

## API Endpoints
<!-- API_START -->
- **GET** `/` 
- **GET** `/api/categories` - Get all categories
- **GET** `/api/subcategories` - Get all subcategories
- **GET** `/api/products` - Get all products
- **GET** `/api/products/{id}` - Get product by ID
- **GET** `/api/blogs` - Get all blogs
- **GET** `/api/blogs/{id}` - Get blog by ID
- **GET** `/api/awards` - Get all awards
- **GET** `/api/certificates` - Get all certificates
- **GET** `/api/careers` - Get all careers
- **POST** `/api/contact` - Submit a contact form
- **POST** `/api/enquiry` - Submit a product enquiry
- **POST** `/api/newsletter/subscribe` - Subscribe to newsletter
- **POST** `/api/admin/login` - Admin login
- **GET** `/api/admin/products` - Get all products (Admin)
- **POST** `/api/admin/products` - Create a product
- **PUT** `/api/admin/products/{id}` - Update a product
- **DELETE** `/api/admin/products/{id}` - Delete a product
- **GET** `/api/admin/categories` - Get all categories (Admin)
- **POST** `/api/admin/categories` - Create a category
- **DELETE** `/api/admin/categories/{id}` - Delete a category
- **GET** `/api/admin/subcategories` - Get all subcategories (Admin)
- **POST** `/api/admin/subcategories` - Create a subcategory
- **DELETE** `/api/admin/subcategories/{id}` - Delete a subcategory
- **GET** `/api/admin/enquiries` - Get all enquiries
- **GET** `/api/admin/contacts` - Get all contact messages
- **GET** `/api/admin/newsletter` - Get newsletter subscribers
- **DELETE** `/api/admin/newsletter/{id}` - Delete a newsletter subscriber
- **PUT** `/api/admin/change-password` - Change admin password

<!-- API_END -->

## Project Dependencies
<!-- DEPS_START -->
### Dependencies
- `bcryptjs`: ^3.0.3
- `cors`: ^2.8.6
- `dotenv`: ^17.4.2
- `express`: ^5.2.1
- `jsonwebtoken`: ^9.0.3
- `mssql`: ^12.5.0
- `multer`: ^2.1.1
- `nodemailer`: ^8.0.6
- `swagger-autogen`: ^2.23.7
- `swagger-ui-express`: ^5.0.1
- `yamljs`: ^0.3.0

### Dev Dependencies
- `husky`: ^9.1.7
- `nodemon`: ^3.1.14

<!-- DEPS_END -->