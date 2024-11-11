import React from 'react';
import { AppBar, Toolbar, Typography, Button, Drawer, List, ListItem, ListItemText, Box, Divider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NavBar = () => {
    const navigate = useNavigate();
    const [drawerOpen, setDrawerOpen] = useState(false);

    // Check if the user is registered by looking for "UserID" in local storage
    const isRegisteredUser = !!localStorage.getItem('UserID');

    const toggleDrawer = (open) => {
        setDrawerOpen(open);
    };

    // Define menu items for both types of users
    const unregisteredMenuItems = ['Home', 'Who We Are', 'Our Services', 'Contact Us'];
    const registeredMenuItems = [
        {
            label: 'Home',
            route: '/'
        },
        'Who We Are',
        'Our Services',
        'Contact Us',
        {
            label: 'Emergency Appointment',
            route: '/emergencyappointment',
            style: { color: 'red', fontWeight: 'bold' }
        },
        {
            label: 'Appointment',
            route: '/appointment'
        },
        'My Appointments',
        {
            label: 'Profile',
            route: '/customer-profile'
        },
        {
            label: 'Pet Registration',
            route: '/pet-registration'
        },
        {
            label: 'View My Pets',
            route: '/view-my-pets'
        }
    ];

    const petsSubMenu = [
        'Pet Registration',
        'View My Pets'
    ];

    const bottomMenuItems = [
        'Inquiry',
        'Feedback',
        'Logout'
    ];

    // Logout function to clear localStorage and navigate to /home
    const handleLogout = () => {
        localStorage.clear(); // Clear all localStorage data
        navigate('/'); // Redirect to the home page
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" color="primary">
                <Toolbar>
                    <MenuIcon onClick={() => toggleDrawer(true)} sx={{ mr: 2, cursor: 'pointer' }} />
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Hospital Logo
                    </Typography>
                    {!isRegisteredUser && (
                        <>
                            <Button color="inherit" onClick={() => navigate('/login')}>Sign In</Button>
                            <Button color="inherit" onClick={() => navigate('/register')}>Create Account</Button>
                        </>
                    )}
                </Toolbar>
            </AppBar>

            {/* Drawer for navigation */}
            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={() => toggleDrawer(false)}
            >
                <Box
                    sx={{ width: 250, display: 'flex', flexDirection: 'column', height: '100%' }}
                    role="presentation"
                    onClick={() => toggleDrawer(false)}
                    onKeyDown={() => toggleDrawer(false)}
                >
                    {/* Top section of the drawer */}
                    <Box sx={{ flexGrow: 1 }}>
                        <List>
                            {(isRegisteredUser ? registeredMenuItems : unregisteredMenuItems).map((item, index) => {
                                const isObjectItem = typeof item === 'object'; // Check if the item is an object
                                return (
                                    <ListItem
                                        button
                                        key={index}
                                        onClick={() =>
                                            navigate(isObjectItem ? item.route : `/${item.toLowerCase().replace(/\s+/g, '-')}`)
                                        }
                                    >
                                        <ListItemText
                                            primary={isObjectItem ? item.label : item}
                                            sx={isObjectItem ? item.style : {}}
                                        />
                                    </ListItem>
                                );
                            })}
                        </List>
                    </Box>

                    {/* Divider to separate top and bottom sections */}
                    <Divider />

                    {/* Bottom section of the drawer */}
                    <Box>
                        <List>
                            {bottomMenuItems.map((text, index) => (
                                <ListItem 
                                    button 
                                    key={index} 
                                    onClick={text === 'Logout' ? handleLogout : () => navigate(`/${text.toLowerCase().replace(/\s+/g, '-')}`)}
                                >
                                    <ListItemText primary={text} />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                </Box>
            </Drawer>
        </Box>
    );
};

export default NavBar;
