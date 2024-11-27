# Role-Based Access Control (RBAC) UI

This project is a Role-Based Access Control (RBAC) system, built with a React frontend, allowing users, roles, and permissions to be managed dynamically. The application helps control user access to various resources based on their assigned roles.

## Project Structure

rbac-ui/
|----backend/
                |------db.json
|----frontend/
                ├── public/
                |    |------index.html
                ├── src/
                |    |------css/
                │   ├── components/           # Reusable UI components
                │   │   ├── Navbar.js         # Navigation bar
                │   │   ├── UserForm.js       # Form for adding/editing users
                │   │   ├── RoleForm.js       # Form for adding/editing roles
                │   ├── pages/                # Main pages
                │   │   ├── UsersPage.js      # Page for managing users
                │   │   ├── RolesPage.js      # Page for managing roles
                │   │   ├── PermissionsPage.js# Page for managing permissions
                │   ├── utils/
                │   │   ├── api.js            # Axios instance for API calls
                │   ├── App.js                # Main app component
                │   ├── index.css             # Global styling
                │   ├── index.js              # Entry point
                ├── package.json



## Features

- **User Management**: Add, edit, and delete users.
- **Role Management**: Create, update, and delete roles, with customizable permissions.
- **Permissions Management**: Add and remove permissions for each role, controlling access to various resources.
- **Dark Mode**: Access all the feature in dark mode.
- **Pagination and Search**: Easy navigation and searching for roles, users, and permissions.
  
## Requirements

To run this project locally, you'll need:

- Node.js (v18 or above)
- npm (v8 or above)
  
## Installation and Setup

### Backend

## The backend is a simple mock using `db.json`, and you can use `json-server` to serve it.

1. Navigate to the `backend/` folder and install `json-server`:

   -cd backend
   -npm install -g json-server

2. Run the server:

   -json-server --watch db.json --port 5000

### Frontend

1. Navigate to the frontend/ folder:
   
   -cd frontend

2. Install the frontend dependencies:

   -npm install

3. Run the development server:
   
   -npm start

Your app will be available at http://localhost:3000.

### Usage
-  **Users Page**: Manage users, assign roles, and edit user information.
-  **Roles Page**: Define roles and assign them to users. You can also manage permissions for each role.
-  **Permissions Page**: Assign permissions to roles. This page allows for the management of which actions a role is allowed to perform.


## Acknowledgments
- React.js for building the frontend UI.
- Material-UI for the UI components.
- json-server for the mock backend.


---

This `README.md` provides a clear structure for your project, including setup instructions for both the frontend and backend, as well as details about the project’s features. It’s a great starting point for other developers to understand and contribute to the project.
# role-based-access-control
# role-based-access-control
# role-based-access-control
