# total-secure-project

## Overview

This project is a web application for managing sales invoices, featuring a backend built with NestJS and a frontend built with Next.js. The application allows users to create, view, update, and delete invoices, with a rich UI for seamless interactions.

## Tech Stack

* **Frontend** : Next.js (Version 14)
* **Backend** : NestJS
* **Database** : PostgreSQL (Supabase)

## Prerequisites

Before you start, make sure you have the following installed:

* Node.js (LTS version recommended)
* PostgreSQL
* Supabase account

## Getting Started

Follow these steps to get the project up and running on your local machine:

### 1. Clone the Repository

git clone https://github.com/tersoo-ahire/total-secure-project.git

cd total-secure-project

### 2. Set Up the Backend

Navigate to the backend directory and install dependencies:

cd backend
npm install

Start the NestJS server:

npm run start:dev

The backend server will start on `http://localhost:8000`

### 3. Set Up the Frontend

Navigate to the frontend directory and install dependencies:

cd ../frontend
npm install

Create a `.env `file in the `frontend` directory and add your Supabase configuration:

NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

Start the Next.js development server:

npm run dev

The frontend application will start on `http://localhost:3000`.

## Running the Project

1. **Start the Backend Server** :
   Make sure the backend server is running. You should see the NestJS server on `http://localhost:8000`.
2. **Start the Frontend Application** :
   Run the frontend development server. Open your browser and navigate to `http://localhost:3000`.


## Contributing

Feel free to submit issues or pull requests if you have suggestions or improvements.

## License

This project is licensed under the MIT License - see the [LICENSE]() file for details.
