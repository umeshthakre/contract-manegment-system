# Contract Management System

## Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

Ensure you have the following installed:
- Node.js (Latest LTS version recommended)
- npm (Node Package Manager)
- Git

### Installation

1. **Clone the Repository**
   ```sh
   git clone https://github.com/umeshthakre/trackus-assignment.git
   ```

2. **Navigate to the Backend Directory**
   ```sh
   cd trackus-assignment/backend
   ```

3. **Install Backend Dependencies**
   ```sh
   npm install
   ```

4. **Navigate to the Frontend Directory**
   ```sh
   cd ../frontend
   ```

5. **Install Frontend Dependencies** (Using `--force` to resolve version conflicts)
   ```sh
   npm install --force
   ```

### Environment Setup

6. **Set Up `.env` Files for Backend**
   - Create a `.env` file inside the `backend` directory.
   - Add required environment variables as specified in the project documentation.

### Running the Application

7. **Start the Backend Server**
   ```sh
   cd ../backend
   node index.js
   ```

8. **Start the Frontend Application**
   ```sh
   cd ../frontend
   npm start
   ```

### Additional Notes
- Ensure all required environment variables are correctly configured.
- The backend should be running before starting the frontend.
- If you face any issues, try clearing `node_modules` and `package-lock.json` before reinstalling dependencies:
  ```sh
  rm -rf node_modules package-lock.json
  npm install
  ```

