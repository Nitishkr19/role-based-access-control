import React, { useState, useEffect } from "react";
import { TextField, Button, Checkbox, Card, CardContent, Box, Typography, Table, TableBody, TableCell, TableContainer, TableRow, Paper } from "@mui/material";
import API from "../utils/api";
import "../css/RoleForm.css";

const RoleForm = ({ role, onSave, setShowForm }) => {
  const [formData, setFormData] = useState({
    name: "",
    permissions: [],
  });

  const [allPermissions, setAllPermissions] = useState([]);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await API.get("/permissions");
        setAllPermissions(response.data);
      } catch (error) {
        console.error("Error fetching permissions:", error);
      }
    };
    fetchPermissions();

    if (role) {
      setFormData({
        ...role,
        permissions: role.permissions.map(p => p.id),
      });
    }
  }, [role]);

  const handlePermissionChange = (permissionId) => {
    const updatedPermissions = formData.permissions.includes(permissionId)
      ? formData.permissions.filter((p) => p !== permissionId)
      : [...formData.permissions, permissionId];
    setFormData({ ...formData, permissions: updatedPermissions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const permissionsToSave = allPermissions.filter(p => formData.permissions.includes(p.id));
      const roleData = {
        ...formData,
        permissions: permissionsToSave,
      };

      if (role) {
        await API.put(`/roles/${role.id}`, roleData);
      } else {
        await API.post("/roles", roleData);
      }
      onSave();
    } catch (error) {
      console.error("Error saving role:", error);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setFormData({ name: "", permissions: [] });
  };

  return (
    <Box className="role-form-container">
      <Card className="role-form-card">
        <CardContent>
          <Typography variant="h5" gutterBottom className="form-title">
            {role ? "Update Role" : "Add Role"}
          </Typography>

          <Box component="form" className="role-form" onSubmit={handleSubmit}>
            <TextField
              label="Role Name"
              name="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
              variant="outlined"
              margin="normal"
              className="role-name-input"
            />


            <TableContainer component={Paper} className="permissions-table">
              <Table>
                <TableBody>
                  {allPermissions.map((permission) => (
                    <TableRow key={permission.id}>
                      <TableCell>
                        <Checkbox
                          checked={formData.permissions.includes(permission.id)}
                          onChange={() => handlePermissionChange(permission.id)}
                          className="checkbox"
                        />
                      </TableCell>
                      <TableCell className="permission-name">
                        {permission.name}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box className="buttons-container">
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleCancel}
                className="cancel-button"
              >
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary" className="submit-button">
                {role ? "Update Role" : "Add Role"}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default RoleForm;
