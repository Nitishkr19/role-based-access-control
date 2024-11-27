import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  Tooltip,
  Fab,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  TablePagination,
} from "@mui/material";
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import UserForm from "../components/UserForm";
import API from "../utils/api";
import "../css/UserPage.css";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [roles, setRoles] = useState([]);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await API.get("/users");
      setUsers(response.data);
      setFilteredUsers(response.data);
      extractRoles(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }, []);


  const applyFilters = useCallback(() => {
    let filtered = users;


    if (searchTerm) {
      filtered = filtered.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }


    if (filterRole) {
      filtered = filtered.filter((user) => user.role === filterRole);
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, filterRole]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const extractRoles = (users) => {
    const uniqueRoles = [...new Set(users.map((user) => user.role))];
    setRoles(uniqueRoles);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/users/${id}`);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleSave = () => {
    setEditingUser(null);
    setShowForm(false);
    fetchUsers();
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box p={3} className="users-page-container">

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">
          Manage Users
        </Typography>


        {!showForm && (
          <Tooltip title="Add User" placement="top">
            <Fab
              color="primary"
              aria-label="add-user"
              onClick={() => {
                setEditingUser(null);
                setShowForm(true);
              }}
              className="add-user-btn"
            >
              <AddIcon />
            </Fab>
          </Tooltip>
        )}
      </Box>

      {showForm ? (
        <UserForm
          user={editingUser}
          onSave={handleSave}
          setShowForm={setShowForm}
        />
      ) : (
        <>

          <Box display="flex" gap={3} mb={3} alignItems="center">
            <TextField
              label="Search by Name"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Filter by Role</InputLabel>
              <Select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                label="Filter by Role"
              >
                <MenuItem value="">All Roles</MenuItem>
                {roles.map((role) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <TableContainer component={Paper} elevation={3}>
            <Table>
              <TableHead>
                <TableRow className="table-header-row">
                  <TableCell className="table-header-cell">Name</TableCell>
                  <TableCell className="table-header-cell">Email</TableCell>
                  <TableCell className="table-header-cell">Role</TableCell>
                  <TableCell className="table-header-cell">Status</TableCell>
                  <TableCell className="table-header-cell">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((user) => (
                    <TableRow key={user.id} className="table-row">
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>{user.status}</TableCell>
                      <TableCell>
                        <Tooltip title="Edit User" placement="top">
                          <IconButton
                            edge="end"
                            aria-label="edit"
                            color="primary"
                            onClick={() => handleEdit(user)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete User" placement="top">
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            color="error"
                            onClick={() => handleDelete(user.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredUsers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        </>
      )}
    </Box>
  );
};

export default UsersPage;
