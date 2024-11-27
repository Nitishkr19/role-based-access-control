import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  Alert,
} from "@mui/material";
import API from "../utils/api";
import "../css/UserForm.css";

const UserForm = ({ user, onSave, setShowForm }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    status: "Active",
  });

  const [roles, setRoles] = useState([]);
  const [existingUsers, setExistingUsers] = useState([]);
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState("");

  useEffect(() => {
    const fetchRolesAndUsers = async () => {
      try {
        const rolesResponse = await API.get("/roles");
        setRoles(rolesResponse.data);

        const usersResponse = await API.get("/users");
        setExistingUsers(usersResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchRolesAndUsers();

    if (user) {
      setFormData(user);
    }
  }, [user]);

  const handleChange = (e) => {
    setErrors({ ...errors, [e.target.name]: "" });
    setGlobalError("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};
    const isDuplicateName = existingUsers.some(
      (existingUser) =>
        existingUser.name === formData.name &&
        existingUser.id !== (user?.id || null)
    );
    const isDuplicateEmail = existingUsers.some(
      (existingUser) =>
        existingUser.email === formData.email &&
        existingUser.id !== (user?.id || null)
    );

    if (formData.name.trim() === "") {
      newErrors.name = "Name is required";
    } else if (isDuplicateName) {
      newErrors.name = "Name is already in use";
    }

    if (formData.email.trim() === "") {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    } else if (isDuplicateEmail) {
      newErrors.email = "Email is already in use";
    }

    if (formData.role.trim() === "") {
      newErrors.role = "Role is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    try {
      if (user) {
        await API.put(`/users/${user.id}`, formData);
      } else {
        await API.post("/users", formData);
      }
      onSave();
    } catch (error) {
      console.error("Error submitting form:", error);
      setGlobalError("Failed to save user. Please try again.");
    }
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  return (
    <Box className="user-form-container">
      <Card className="user-form-card">
        <CardContent>
          <Typography variant="h5" className="user-form-title">
            {user ? "Update User" : "Add New User"}
          </Typography>
          {globalError && <Alert severity="error">{globalError}</Alert>}
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
                error={!!errors.name}
                helperText={errors.name}
                className="user-form-input"
              />

              <TextField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
                error={!!errors.email}
                helperText={errors.email}
                className="user-form-input"
              />

              <TextField
                select
                label="Role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
                error={!!errors.role}
                helperText={errors.role}
                className="user-form-input"
              >
                {roles.map((role) => (
                  <MenuItem key={role.id} value={role.name}>
                    {role.name}
                  </MenuItem>
                ))}
              </TextField>


              <TextField
                select
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
                className="user-form-input"
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </TextField>


              <Stack direction="row" spacing={2} justifyContent="center">
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleCancel}
                  className="user-form-cancel-button"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  className="user-form-submit-button"
                >
                  {user ? "Update User" : "Add User"}
                </Button>
              </Stack>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserForm;
