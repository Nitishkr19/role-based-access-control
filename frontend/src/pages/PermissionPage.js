import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    TextField,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TablePagination,
    Fab,
    Tooltip
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import API from "../utils/api";
import '../css/PermissionPage.css';

const PermissionsPage = () => {
    const [permissions, setPermissions] = useState([]);
    const [newPermission, setNewPermission] = useState("");
    const [editingPermission, setEditingPermission] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [showAddPermission, setShowAddPermission] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);


    const fetchPermissions = async () => {
        try {
            const response = await API.get("/permissions");
            setPermissions(response.data);
        } catch (error) {
            console.error("Error fetching permissions:", error);
        }
    };

    useEffect(() => {
        fetchPermissions();
    }, []);

    const addPermission = async () => {
        const trimmedPermission = newPermission.trim();
        if (trimmedPermission && !permissions.some(p => p.name === trimmedPermission)) {
            try {
                await API.post("/permissions", { name: trimmedPermission });
                setNewPermission("");
                setShowAddPermission(false);
                fetchPermissions();
            } catch (error) {
                console.error("Error adding permission:", error);
            }
        }
    };

    const cancelAddPermission = () => {
        setNewPermission("");
        setShowAddPermission(false);
    };

    const editPermission = async () => {
        if (editingPermission) {
            try {
                await API.put(`/permissions/${editingPermission.id}`, editingPermission);
                setIsDialogOpen(false);
                setEditingPermission(null);
                fetchPermissions();
            } catch (error) {
                console.error("Error editing permission:", error);
            }
        }
    };

    const deletePermission = async (id) => {
        try {
            await API.delete(`/permissions/${id}`);
            fetchPermissions();
        } catch (error) {
            console.error("Error deleting permission:", error);
        }
    };

    const openEditDialog = (permission) => {
        setEditingPermission(permission);
        setIsDialogOpen(true);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredPermissions = permissions.filter(permission =>
        permission.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Box className="permissions-container">
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" color="primary" fontWeight="bold">
                    Manage Permission
                </Typography>

                {!showAddPermission && (
                    <Tooltip display="flex" placement="top">
                        <Fab
                            color="primary"
                            aria-label="add"
                            onClick={() => setShowAddPermission(true)}
                            className="add-permission-fab"
                        >
                            <AddIcon />
                        </Fab>
                    </Tooltip>
                )}
            </Box>
            {showAddPermission && (
                <div className="add-permission-container">
                    <TextField
                        label="New Permission"
                        value={newPermission}
                        onChange={(e) => setNewPermission(e.target.value)}
                        className="permission-input"
                    />
                    <Button onClick={addPermission} variant="contained" color="primary">
                        Add
                    </Button>
                    <Button onClick={cancelAddPermission} variant="outlined" color="secondary">
                        Cancel
                    </Button>
                </div>
            )}

            <TextField
                label="Search Permission"
                variant="outlined"
                fullWidth
                value={searchQuery}
                onChange={handleSearchChange}
                style={{ marginBottom: '20px' }}
            />

            <TableContainer component={Paper} className="permission-table-container">
                <Table>
                    <TableHead>
                        <TableRow className="table-header-row">
                            <TableCell>Permission Name</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredPermissions
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((permission) => (
                                <TableRow key={permission.id}>
                                    <TableCell component="th" scope="row">
                                        {permission.name}
                                    </TableCell>
                                    <TableCell className="permission-actions">
                                        <IconButton edge="end" aria-label="edit" color="primary" onClick={() => openEditDialog(permission)}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton edge="end" aria-label="delete" color="error" onClick={() => deletePermission(permission.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Pagination */}
            <TablePagination
                component="div"
                count={filteredPermissions.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />

            <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
                <DialogTitle>Edit Permission</DialogTitle>
                <DialogContent className="dialog-content">
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Permission Name"
                        type="text"
                        fullWidth
                        value={editingPermission ? editingPermission.name : ""}
                        onChange={(e) => setEditingPermission({ ...editingPermission, name: e.target.value })}
                    />
                </DialogContent>
                <DialogActions className="dialog-actions">
                    <Button onClick={() => setIsDialogOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={editPermission} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default PermissionsPage;
