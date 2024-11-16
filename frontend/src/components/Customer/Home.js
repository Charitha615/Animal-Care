import React from 'react';
import { Box, Typography, Grid, Paper, Container, Divider, Link } from '@mui/material';
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
                <Box sx={{ width: '80%', height: '800px' }}> {/* Adjust height as needed */}
                    <Map /> {/* Integrate Map component */}
                </Box>
            </Box>

            {/* Our Services Section */}
            <Box
                sx={{
                    py: 8,
                    backgroundColor: '#f0f4f8',
                    backgroundImage: 'linear-gradient(135deg, #ffffff 25%, #f0f4f8 100%)',
                }}
            >
                <Container>
                    <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Our Services
                    </Typography>
                    <Divider
                        sx={{
                            mb: 4,
                            width: '60%',
                            margin: '0 auto',
                            borderColor: '#007BFF',
                            borderWidth: 2,
                        }}
                    />
                    <Grid container spacing={4}>
                        {[
                            {
                                title: 'Emergency Care Services',
                                description:
                                    'We provide 24/7 emergency services with highly trained professionals and state-of-the-art facilities.',
                            },
                            {
                                title: 'Diagnostic Imaging',
                                description:
                                    'Our advanced imaging department offers MRI, CT scans, ultrasounds, and more.',
                            },
                            {
                                title: 'Maternity & Neonatal Care',
                                description:
                                    'Dedicated care for mothers and newborns, ensuring the best possible outcomes.',
                            },
                        ].map((service, index) => (
                            <Grid item xs={12} md={4} key={index}>
                                <Paper
                                    elevation={6}
                                    sx={{
                                        padding: 4,
                                        textAlign: 'center',
                                        borderRadius: 3,
                                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                        '&:hover': {
                                            transform: 'scale(1.05)',
                                            boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.15)',
                                        },
                                    }}
                                >
                                    <Typography
                                        variant="h6"
                                        gutterBottom
                                        sx={{ fontWeight: 'bold', color: '#007BFF' }}
                                    >
                                        {service.title}
                                    </Typography>
                                    <Typography variant="body1" color="textSecondary">
                                        {service.description}
                                    </Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Contact Details Section */}
            <Box
                sx={{
                    py: 8,
                    backgroundColor: '#ffffff',
                }}
            >
                <Container>
                    <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Contact Us
                    </Typography>
                    <Divider
                        sx={{
                            mb: 4,
                            width: '60%',
                            margin: '0 auto',
                            borderColor: '#007BFF',
                            borderWidth: 2,
                        }}
                    />
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={6}>
                            <Paper
                                elevation={6}
                                sx={{
                                    padding: 4,
                                    borderRadius: 3,
                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                    '&:hover': {
                                        transform: 'scale(1.05)',
                                        boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.15)',
                                    },
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    gutterBottom
                                    sx={{ fontWeight: 'bold', color: '#007BFF' }}
                                >
                                    Address
                                </Typography>
                                <Typography variant="body1" color="textSecondary">
                                    1234 Health St, Medical City, 56789
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Paper
                                elevation={6}
                                sx={{
                                    padding: 4,
                                    borderRadius: 3,
                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                    '&:hover': {
                                        transform: 'scale(1.05)',
                                        boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.15)',
                                    },
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    gutterBottom
                                    sx={{ fontWeight: 'bold', color: '#007BFF' }}
                                >
                                    Contact Information
                                </Typography>
                                <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
                                    <strong>Phone:</strong> +1 (123) 456-7890
                                </Typography>
                                <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
                                    <strong>Email:</strong> contact@hospital.com
                                </Typography>
                                <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
                                    <strong>Working Hours:</strong> Mon-Fri, 8 AM - 6 PM
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Footer */}
            <Box sx={{ py: 6, backgroundColor: '#303030', color: 'white',marginTop:0 }}>
                <Container>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={3}>
                            <Typography variant="h6" gutterBottom>
                                Quick Links
                            </Typography>
                            <Link href="/" color="inherit" underline="hover">Home</Link><br />
                            <Link href="/who-we-are" color="inherit" underline="hover">Who We Are</Link><br />
                            <Link href="/our-services" color="inherit" underline="hover">Our Services</Link><br />
                            <Link href="/contact-us" color="inherit" underline="hover">Contact Us</Link>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Typography variant="h6" gutterBottom>
                                Services
                            </Typography>
                            <Link href="/emergencyappointment" color="inherit" underline="hover">Emergency Appointment</Link><br />
                            <Link href="/appointment" color="inherit" underline="hover">Appointment</Link><br />
                            <Link href="/maternity-care" color="inherit" underline="hover">Maternity Care</Link>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Typography variant="h6" gutterBottom>
                                Contact
                            </Typography>
                            <Typography variant="body2">1234 Health St, Medical City, 56789</Typography>
                            <Typography variant="body2">Phone: +1 (123) 456-7890</Typography>
                            <Typography variant="body2">Email: contact@hospital.com</Typography>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Typography variant="h6" gutterBottom>
                                Follow Us
                            </Typography>
                            <Link href="#" color="inherit" underline="hover">Facebook</Link><br />
                            <Link href="#" color="inherit" underline="hover">Twitter</Link><br />
                            <Link href="#" color="inherit" underline="hover">Instagram</Link>
                        </Grid>
                    </Grid>
                    <Divider sx={{ my: 4, backgroundColor: 'gray' }} />
                    <Typography variant="body2" align="center">
                        © 2024 Hospital Animal Care. All rights reserved.
                    </Typography>
                </Container>
            </Box>
        </Box>
    );
};

export default Home;
