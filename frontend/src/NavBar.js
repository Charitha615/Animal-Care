import React, { useState, useEffect } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    List,
    ListItem,
    ListItemText,
    Badge
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';

const NavBar = () => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [hasNewNotifications, setHasNewNotifications] = useState(false);
    const [open, setOpen] = useState(false);

    const isRegisteredUser = !!localStorage.getItem('UserID');
    const unregisteredMenuItems = ['Home', 'Who We Are', 'Our Services', 'Contact Us'];
    const registeredMenuItems = [
        { label: 'Emergency Appointment', route: '/emergencyappointment', style: { color: 'yellow', fontWeight: 'bold', fontSize: 20 } },
        { label: 'Appointment', route: '/appointment' },
        'My Appointments',
        { label: 'Profile', route: '/customer-profile' },
        { label: 'Pet Registration', route: '/pet-registration' },
        { label: 'View My Pets', route: '/view-my-pets' }
    ];
    const bottomMenuItems = ['Inquiry', 'Feedback', 'Logout'];

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const userID = localStorage.getItem('UserID');
                const response = await axios.get(`http://localhost/animal_care_api/Pet/view_my_pets.php?UserID=${userID}`);
                const petsData = response.data.data;

                const upcomingVaccinations = petsData.flatMap((pet) =>
                    pet.vaccinations
                        .filter(vaccination => vaccination.status === 'upcoming')
                        .map(vaccination => {
                            const daysRemaining = dayjs(vaccination.vaccination_date).diff(dayjs(), 'day');
                            return {
                                petName: pet.pet_name,
                                vaccinationName: vaccination.vaccination_name,
                                vaccinationDate: vaccination.vaccination_date,
                                daysRemaining
                            };
                        })
                );

                setNotifications(upcomingVaccinations);
                setHasNewNotifications(upcomingVaccinations.length > 0);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchNotifications();
        const interval = setInterval(fetchNotifications, 1000); // Fetch every 60 seconds
        return () => clearInterval(interval);
    }, []);

    const handleNotificationClick = () => {
        setHasNewNotifications(false);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" color="primary">
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={handleNotificationClick}>
                        <Badge
                            badgeContent={notifications.length}
                            color="error"
                            sx={{ animation: hasNewNotifications ? 'shake 0.5s infinite' : 'none' }}
                        >
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>
                    <Typography variant="h6" sx={{ flexGrow: 1, ml: 1 }}>
                        <a href="/" style={{ textDecoration: 'none', color: 'inherit' }}>Animal Care</a>
                    </Typography>

                    {(isRegisteredUser ? registeredMenuItems : unregisteredMenuItems).map((item, index) => {
                        const isObjectItem = typeof item === 'object';
                        return (
                            <Button
                                key={index}
                                color="inherit"
                                onClick={() => navigate(isObjectItem ? item.route : `/${item.toLowerCase().replace(/\s+/g, '-')}`)}
                                sx={isObjectItem ? item.style : {}}
                            >
                                {isObjectItem ? item.label : item}
                            </Button>
                        );
                    })}

                    {!isRegisteredUser && (
                        <>
                            <Button color="inherit" onClick={() => navigate('/login')}>Sign In</Button>
                            <Button color="inherit" onClick={() => navigate('/register')}>Create Account</Button>
                        </>
                    )}
                    {isRegisteredUser && (
                        <>
                            {bottomMenuItems.map((text, index) => (
                                <Button
                                    key={index}
                                    color="inherit"
                                    onClick={() => {
                                        if (text === 'Inquiry') navigate('/customer-Inquiry');
                                        else if (text === 'Feedback') navigate('/customer-Feedback');
                                        else if (text === 'Logout') handleLogout();
                                    }}
                                >
                                    {text}
                                </Button>
                            ))}
                        </>
                    )}
                </Toolbar>
            </AppBar>

            {/* Notification Dialog */}
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle>Notification</DialogTitle>
                <DialogContent>
                    {notifications.length > 0 ? (
                        <List>
                            {notifications.map((notification, index) => (
                                <ListItem key={index} divider>
                                    <ListItemText
                                        primary={`${notification.petName}'s ${notification.vaccinationName} Vaccination`}
                                        secondary={`Scheduled on ${notification.vaccinationDate} (${notification.daysRemaining} days remaining)`}
                                        sx={{
                                            color: notification.daysRemaining < 5 ? 'red' : 'inherit'
                                        }}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Typography variant="body2">No Notifications</Typography>
                    )}
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default NavBar;





// import React from 'react';
// import { AppBar, Toolbar, Typography, Button, Drawer, List, ListItem, ListItemText, Box, Divider } from '@mui/material';
// import MenuIcon from '@mui/icons-material/Menu';
// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
//
// const NavBar = () => {
//     const navigate = useNavigate();
//     const [drawerOpen, setDrawerOpen] = useState(false);
//
//     // Check if the user is registered by looking for "UserID" in local storage
//     const isRegisteredUser = !!localStorage.getItem('UserID');
//
//     const toggleDrawer = (open) => {
//         setDrawerOpen(open);
//     };
//
//     // Define menu items for both types of users
//     const unregisteredMenuItems = ['Home', 'Who We Are', 'Our Services', 'Contact Us'];
//     const registeredMenuItems = [
//         {
//             label: 'Home',
//             route: '/'
//         },
//         'Who We Are',
//         'Our Services',
//         'Contact Us',
//         {
//             label: 'Emergency Appointment',
//             route: '/emergencyappointment',
//             style: { color: 'red', fontWeight: 'bold' }
//         },
//         {
//             label: 'Appointment',
//             route: '/appointment'
//         },
//         'My Appointments',
//         {
//             label: 'Profile',
//             route: '/customer-profile'
//         },
//         {
//             label: 'Pet Registration',
//             route: '/pet-registration'
//         },
//         {
//             label: 'View My Pets',
//             route: '/view-my-pets'
//         }
//     ];
//
//     const petsSubMenu = [
//         'Pet Registration',
//         'View My Pets'
//     ];
//
//     const bottomMenuItems = [
//         'Inquiry',
//         'Feedback',
//         'Logout'
//     ];
//
//     // Logout function to clear localStorage and navigate to /home
//     const handleLogout = () => {
//         localStorage.clear(); // Clear all localStorage data
//         navigate('/'); // Redirect to the home page
//     };
//
//     return (
//         <Box sx={{ flexGrow: 1 }}>
//             <AppBar position="static" color="primary">
//                 <Toolbar>
//                     <MenuIcon onClick={() => toggleDrawer(true)} sx={{ mr: 2, cursor: 'pointer' }} />
//                     <Typography variant="h6" sx={{ flexGrow: 1 }}>
//                         Hospital Logo
//                     </Typography>
//                     {!isRegisteredUser && (
//                         <>
//                             <Button color="inherit" onClick={() => navigate('/login')}>Sign In</Button>
//                             <Button color="inherit" onClick={() => navigate('/register')}>Create Account</Button>
//                         </>
//                     )}
//                 </Toolbar>
//             </AppBar>
//
//             {/* Drawer for navigation */}
//             <Drawer
//                 anchor="left"
//                 open={drawerOpen}
//                 onClose={() => toggleDrawer(false)}
//             >
//                 <Box
//                     sx={{ width: 250, display: 'flex', flexDirection: 'column', height: '100%' }}
//                     role="presentation"
//                     onClick={() => toggleDrawer(false)}
//                     onKeyDown={() => toggleDrawer(false)}
//                 >
//                     {/* Top section of the drawer */}
//                     <Box sx={{ flexGrow: 1 }}>
//                         <List>
//                             {(isRegisteredUser ? registeredMenuItems : unregisteredMenuItems).map((item, index) => {
//                                 const isObjectItem = typeof item === 'object'; // Check if the item is an object
//                                 return (
//                                     <ListItem
//                                         button
//                                         key={index}
//                                         onClick={() =>
//                                             navigate(isObjectItem ? item.route : `/${item.toLowerCase().replace(/\s+/g, '-')}`)
//                                         }
//                                     >
//                                         <ListItemText
//                                             primary={isObjectItem ? item.label : item}
//                                             sx={isObjectItem ? item.style : {}}
//                                         />
//                                     </ListItem>
//                                 );
//                             })}
//                         </List>
//                     </Box>
//
//                     {/* Divider to separate top and bottom sections */}
//                     <Divider />
//
//                     {/* Bottom section of the drawer */}
//                     <Box>
//                         <List>
//                             {bottomMenuItems.map((text, index) => (
//                                 <ListItem
//                                     button
//                                     key={index}
//                                     onClick={() => {
//                                         if (text === 'Inquiry') {
//                                             navigate('/customer-Inquiry'); // Direct to /customer-Inquiry for Inquiry
//                                         }
//                                         else if (text === 'Feedback') {
//                                             navigate('/customer-Feedback'); // Direct to /customer-Inquiry for Inquiry
//                                         }else if (text === 'Logout') {
//                                             handleLogout();
//                                         } else {
//                                             navigate(`/${text.toLowerCase().replace(/\s+/g, '-')}`);
//                                         }
//                                     }}
//                                 >
//                                     <ListItemText primary={text} />
//                                 </ListItem>
//                             ))}
//                         </List>
//                     </Box>
//
//                 </Box>
//
//             </Drawer>
//         </Box>
//     );
// };
//
// export default NavBar;
