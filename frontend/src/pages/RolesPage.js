import React, { useState, useEffect } from "react";
import {
    Box,
    Table,
    TableBody,
    TableCell,
    IconButton,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Tooltip,
    TextField,
    TablePagination,
    Fab,
} from "@mui/material";
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import RoleForm from "../components/RoleForm";
import API from "../utils/api";
import "../css/RolePage.css";

const RolesPage = () => {
    const [roles, setRoles] = useState([]);
    const [filteredRoles, setFilteredRoles] = useState([]);
    const [editingRole, setEditingRole] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);


    const fetchRoles = async () => {
        try {
            const response = await API.get("/roles");
            setRoles(response.data);
            setFilteredRoles(response.data);
        } catch (error) {
            console.error("Error fetching roles:", error);
        }
    };

    useEffect(() => {
        fetchRoles();
    }, []);


    useEffect(() => {
        const filtered = roles.filter((role) =>
            role.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredRoles(filtered);
    }, [searchTerm, roles]);


    const handleEdit = (role) => {
        setEditingRole(role);
        setShowForm(true);
    };


    const handleDelete = async (id) => {
        try {
            await API.delete(`/roles/${id}`);
            fetchRoles();
        } catch (error) {
            console.error("Error deleting role:", error);
        }
    };

    const handleSave = () => {
        setEditingRole(null);
        setShowForm(false);
        fetchRoles();
    };

    const handleCancel = () => {
        setEditingRole(null);
        setShowForm(false);
    };


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Box p={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" color="primary" fontWeight="bold">
                    Manage Roles
                </Typography>
                {!showForm && (
                    <Tooltip title="Add Role" placement="top">
                        <Fab
                            color="primary"
                            aria-label="add-role"
                            onClick={() => setShowForm(true)}
                        >
                            <AddIcon />
                        </Fab>
                    </Tooltip>
                )}
            </Box>

            {showForm ? (
                <RoleForm role={editingRole} onSave={handleSave} setShowForm={handleCancel} />
            ) : (
                <>
                    {/* Filter Input */}
                    <Box display="flex" gap={3} mb={3} alignItems="center">
                        <TextField
                            label="Search by Role Name"
                            variant="outlined"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: "300px" }}
                        />
                    </Box>
                    <TableContainer component={Paper} elevation={3}>
                        <Table>
                            <TableHead>
                                <TableRow className="table-header-row">
                                    <TableCell style={{ fontWeight: "bold" }}>Role Name</TableCell>
                                    <TableCell style={{ fontWeight: "bold" }}>Permissions</TableCell>
                                    <TableCell style={{ fontWeight: "bold" }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredRoles
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((role) => (
                                        <TableRow
                                            key={role.id}
                                            hover
                                            sx={{
                                                "&:hover": { backgroundColor: "#f0f8ff", transition: "0.3s" },
                                            }}
                                        >
                                            <TableCell>{role.name}</TableCell>
                                            <TableCell>
                                                {Array.isArray(role.permissions)
                                                    ? role.permissions.map((p) => p.name).join(", ")
                                                    : "No permissions assigned"}
                                            </TableCell>
                                            <TableCell>
                                                <Tooltip title="Edit Role" placement="top">
                                                    <IconButton
                                                        edge="end"
                                                        aria-label="edit"
                                                        color="primary"
                                                        onClick={() => handleEdit(role)}
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Delete Role" placement="top">
                                                    <IconButton
                                                        edge="end"
                                                        aria-label="delete"
                                                        color="error"
                                                        onClick={() => handleDelete(role.id)}
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
                        count={filteredRoles.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </>
            )}
        </Box>
    );
};

export default RolesPage;
