# WorkWave Company Portal

WorkWave is a company management portal designed to help administrators manage employees efficiently. The system consists of a **frontend client** (React/TypeScript/Vite) and a **backend API** (Node.js/Express), and is ideal for internal tool-style applications where users (employees) are managed exclusively by an admin.

## Table of Contents

- [Features](#features)
- [About the Project](#about-the-project)
- [Authentication Model](#authentication-model)
- [Admin Credentials](#admin-credentials)
- [Setup & Installation](#setup--installation)
  - [Backend: workwave-api](#backend-workwave-api)
  - [Frontend: workwave-client](#frontend-workwave-client)
- [Environment Variables Example](#environment-variables-example)
- [Running Both Projects Together](#running-both-projects-together)
- [Usage Tips](#usage-tips)

---

## Features

- Admin manages users/employees.
- No signup page; employees are created by admin.
- Employees get login access after being added.
- Modern frontend built with React, TypeScript, and Vite.
- Secure backend API with Express (Node.js).
- Easy local setup!

---

## About the Project

The portal streamlines the process of employee management. Only the **admin** can add new users; there is no public signup route. Employees can log in once added by the admin.

You should set up both the frontend and backend locally for development.

---

## Authentication Model

- **No signup option**
- Login flow:
  1. **Admin** logs in using provided credentials.
  2. Admin adds employees.
  3. Employees receive credentials and can log in.
- Only admin can add (register) users.

---

## Admin Credentials

- **Admin Route (Login):** `/admin/login`  
  (Backend API endpoint for admin authentication)
- **Credentials:**
  - **Email:** `admin@gmail.com`
  - **Password:** `Admin@123`

Use these to access the admin dashboard and add users.

---

## Setup & Installation

Two repositories:
- **Frontend:** [`workwave-client`](https://github.com/Ziyadh-ali/workwave-client)
- **Backend:** [`workwave-api`](https://github.com/Ziyadh-ali/workwave-api)

### Backend: workwave-api

1. **Clone the backend repo:**
   ```sh
   git clone https://github.com/Ziyadh-ali/workwave-api.git
   cd workwave-api
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Setup environment variables:**
   - Create a `.env` file as required (see [Environment Variables Example](#environment-variables-example)).
   - You may need to specify database connection, port, JWT secret, etc.

4. **Run the backend server:**
   ```sh
   npm run dev
   ```
   or
   ```sh
   node index.js
   ```

   The backend typically runs on `http://localhost:5000` or whichever port is set.

---

### Frontend: workwave-client

1. **Clone the frontend repo:**
   ```sh
   git clone https://github.com/Ziyadh-ali/workwave-client.git
   cd workwave-client
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Configure connection to backend API:**
   - Set the backend API URL (default: `http://localhost:5000`) in your environment or config files.

4. **Run the frontend:**
   ```sh
   npm run dev
   ```

   This will start the app locally, usually on `http://localhost:5173` or as shown in your config.

---

## Environment Variables Example

Below are sample environment variables configurations needed for development. Copy the following to `.env` files as specified:

### Backend: `.env` (in `workwave-api` root):

```ini
# Backend
PORT=5000
NODE_ENV=development
ALLOWED_ORIGIN=http://localhost:5173

# Database
MONGO_URI=your_mongodb_connection_string

# JWT Secrets
ACCESS_SECRET_KEY=your_access_secret
REFRESH_SECRET_KEY=your_refresh_secret
RESET_PASSWORD_SECRET_KEY=your_reset_secret

# Token Expiry Times
ACCESS_EXPIRES_IN=1d
REFRESH_EXPIRES_IN=2d
RESET_TOKEN_EXPIRES_IN=2m

# Cloudinary
CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret

# Nodemailer
EMAIL_USER=your_email_address
EMAIL_PASS=your_email_app_password

# Calendarific API
CALENDARIFIC_API_KEY=your_calendarific_api_key
CALENDARIFIC_URL=https://calendarific.com/api/v2/holidays
```

### Frontend: `.env` or `.env.local` (in `workwave-client` root):

```ini
# Front end 
VITE_API_URL=http://localhost:5000

# Calendarific API (Used for Holidays)
VITE_CALENDARIFIC_API_KEY=your_calendarific_api_key
VITE_CALENDARIFIC_URL=https://calendarific.com/api/v2/holidays
```

---

## Running Both Projects Together

To run the full application:

- Start the backend API first.
- Then start the frontend client.
- Make sure the frontend is configured to communicate with the correct backend URL.

**Tip:** You may need to update environment/configuration files in the frontend to point to your backend (`REACT_APP_API_URL` or similar).

---

## Usage Tips

- Login as **admin** first (`admin@gmail.com` / `Admin@123`) to add employees.
- Employees can only log in after being added by admin.
- Protect your admin credentials!

---

## More

- For API endpoints & data models, see backend documentation or code.
- For customization (branding, features), modify both frontend and backend as needed.
