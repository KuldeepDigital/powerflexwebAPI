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