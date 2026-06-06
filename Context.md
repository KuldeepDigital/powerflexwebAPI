# Power Flexweb API Context

## Overview
PowerflexwebAPI is a backend REST API developed using Node.js and Express. It serves as the backend for a web application (likely a corporate or e-commerce site for "Powerflex"), providing both public endpoints for user-facing content and secured admin endpoints for content management. 

## Technology Stack
- **Runtime:** Node.js
- **Framework:** Express.js (`express`)
- **Database:** Microsoft SQL Server (`mssql`)
- **Authentication:** JSON Web Tokens (`jsonwebtoken`) & `bcryptjs` for password hashing
- **File Uploads:** `multer` (Handling product images and user enquiry drawings)
- **Environment Management:** `dotenv`
- **CORS:** `cors` (Configured to allow requests from Vite dev server at `http://localhost:5173`)
- **Email/Mail:** `nodemailer`
- **API Documentation:** `swagger-ui-express` and `swagger-autogen` (Automatically generates OpenAPI schema from routes and controller comments)

## Project Structure
- `server.js`: The main entry point. Sets up middleware, static file serving (`/uploads`), mounts the API routes, and serves the Swagger UI.
- `db.js`: Handles connection to the MSSQL database using connection pooling.
- `swagger.js`: Generates `swagger-output.json` by inspecting the express routes. Triggered automatically on `npm run dev`.
- `routes/`: Contains routing definitions.
  - `public.js`: Publicly accessible routes under `/api`.
  - `admin.js`: JWT-protected routes under `/api/admin`.
- `controllers/`: Contains the business logic for the routes.
  - `adminController.js`: Handles admin operations like CRUD on products, categories, subcategories, and viewing user submissions.
  - `contentController.js`: Handles fetching blogs, awards, certificates, and career data.
  - `formsController.js`: Handles contact forms, enquiries, and newsletter subscriptions.
  - `productsController.js`: Handles fetching products, categories, and subcategories for the public facing site.
- `middleware/`: Contains custom middleware.
  - `auth.js` (assumed): Middleware to verify JWT tokens for admin routes.
- `.env`: Stores environment variables (Database credentials, port, JWT secrets, etc.).

## Key Features & Endpoints

### Public API (`/api`)
- **Products:** Fetch categories, subcategories, and individual products.
- **Content:** Fetch blogs, awards, certificates, and careers information.
- **Forms:** 
  - Submit contact forms.
  - Submit product enquiries (supports file uploads for drawings).
  - Subscribe to the newsletter.

### Admin API (`/api/admin`) - *JWT Protected*
- **Authentication:** Admin login and password changes.
- **Content Management:** Create, update, delete products (with image uploads), categories, and subcategories.
- **Data Viewing:** View submitted enquiries and contact forms.
- **Newsletter:** Manage newsletter subscriptions.

## File Handling
The application uses `multer` to handle multipart/form-data. Uploaded files (like product images and enquiry drawings) are saved in the `uploads` directory and served statically via the `/uploads` route in `server.js`.

## API Documentation Workflow
The API endpoints are automatically documented using `swagger-autogen`. The process works as follows:
1. **Annotations**: Controller functions include special comments (e.g., `/* #swagger.tags = ['Public Content'] #swagger.summary = 'Get all blogs' */`) to assign tags and descriptions.
2. **Generation**: The `npm run swagger` script (which runs `swagger.js`) inspects the routes and these annotations to build the full OpenAPI spec (`swagger-output.json`). It also automatically infers datatypes by looking at `req.body` references in the code.
3. **Serving**: `server.js` reads the generated JSON and hosts it via `swagger-ui-express` at `/api-docs`. This generation happens automatically every time the server starts.
