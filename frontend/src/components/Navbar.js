import React, { useContext } from "react";
import { AppBar, Toolbar, Typography, Switch, Box, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { ThemeContext } from "../App";
import '../css/Navbar.css'

const Navbar = () => {
  const { darkMode, setDarkMode } = useContext(ThemeContext);

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Role-Based Access Control
        </Typography>
        <Box display="flex" gap={2}>
          <Button component={Link} to="/users" color="inherit">
            Users
          </Button>
          <Button component={Link} to="/roles" color="inherit">
            Roles
          </Button>
          <Button component={Link} to="/permissions" color="inherit">
            Permissions
          </Button>
        </Box>
        <Box ml={3} display="flex" alignItems="center">
          <Typography variant="body1" sx={{ mr: 1 }}>
            Dark Mode
          </Typography>
          <Switch
            checked={darkMode}
            onChange={(e) => setDarkMode(e.target.checked)}
            color="default"
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
