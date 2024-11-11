import React from 'react';
import { Box, Typography, Grid, Paper, Container, Divider } from '@mui/material';
import NavBar from '../../NavBar';
import Map from './Map';

const Home = () => {
    const locations = [
        { "name": "Piliyandala", "lat": 6.8018, "lng": 79.9202 },
        { "name": "Maharagama", "lat": 6.8463, "lng": 79.9285 },
        { "name": "Matara", "lat": 5.945, "lng": 80.554 }
    ];

    return (
        <Box sx={{ flexGrow: 1 }}>
            <NavBar />
            {/* Main image banner */}
            <Box
                sx={{
                    height: '80vh',
                    backgroundImage: 'url(https://cdna.artstation.com/p/marketplace/presentation_assets/002/964/164/large/file.jpg?1693155098)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography variant="h3" color="white" sx={{ textShadow: '2px 2px 8px rgba(0,0,0,0.8)' }}>
                    Welcome to Animal Care
                </Typography>
            </Box>

            {/* Map section */}
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Box sx={{ width: '80%', height: '200px' }}> {/* Set the height and width for the map */}
                    <Map locations={locations} />
                </Box>
            </Box>

            {/* Our Services Section */}
            <Box sx={{ py: 8, backgroundColor: '#f7f7f7', marginTop:50 }}>
                <Container>
                    <Typography variant="h4" align="center" gutterBottom>
                        Our Services
                    </Typography>
                    <Divider sx={{ mb: 4, width: '80%', margin: '0 auto' }} />
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={4}>
                            <Paper elevation={3} sx={{ padding: 3, textAlign: 'center' }}>
                                <Typography variant="h6" gutterBottom>
                                    Emergency Care Services
                                </Typography>
                                <Typography variant="body1">
                                    We provide 24/7 emergency services with highly trained professionals and state-of-the-art facilities.
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Paper elevation={3} sx={{ padding: 3, textAlign: 'center' }}>
                                <Typography variant="h6" gutterBottom>
                                    Diagnostic Imaging
                                </Typography>
                                <Typography variant="body1">
                                    Our advanced imaging department offers MRI, CT scans, ultrasounds, and more.
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Paper elevation={3} sx={{ padding: 3, textAlign: 'center' }}>
                                <Typography variant="h6" gutterBottom>
                                    Maternity & Neonatal Care
                                </Typography>
                                <Typography variant="body1">
                                    Dedicated care for mothers and newborns, ensuring the best possible outcomes.
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Contact Details Section */}
            <Box sx={{ py: 8 }}>
                <Container>
                    <Typography variant="h4" align="center" gutterBottom>
                        Contact Us
                    </Typography>
                    <Divider sx={{ mb: 4, width: '80%', margin: '0 auto' }} />
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={6}>
                            <Paper elevation={3} sx={{ padding: 3 }}>
                                <Typography variant="h6" gutterBottom>
                                    Address
                                </Typography>
                                <Typography variant="body1">
                                    1234 Health St, Medical City, 56789
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Paper elevation={3} sx={{ padding: 3 }}>
                                <Typography variant="h6" gutterBottom>
                                    Contact Information
                                </Typography>
                                <Typography variant="body1" sx={{ mt: 1 }}>
                                    <strong>Phone:</strong> +1 (123) 456-7890
                                </Typography>
                                <Typography variant="body1" sx={{ mt: 1 }}>
                                    <strong>Email:</strong> contact@hospital.com
                                </Typography>
                                <Typography variant="body1" sx={{ mt: 1 }}>
                                    <strong>Working Hours:</strong> Mon-Fri, 8 AM - 6 PM
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Footer */}
            <Box sx={{ py: 4, backgroundColor: '#303030', color: 'white', textAlign: 'center' }}>
                <Typography variant="body2">© 2024 Hospital Name</Typography>
            </Box>
        </Box>
    );
};

export default Home;
