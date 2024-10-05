import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Grid, Paper, Container, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../NavBar'; // Import the NavBar

const Appointment = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [serviceCenters, setServiceCenters] = useState([]);

    // Fetch service centers from the API
    useEffect(() => {
        fetch('http://localhost/animal_care_api/Service_Provider/get_all_service_providers.php')
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    setServiceCenters(data.data); // Assuming the service centers are in 'data' array
                }
            })
            .catch(error => {
                console.error('Error fetching service centers:', error);
            });
    }, []);

    // Filter service centers based on search term
    const filteredCenters = serviceCenters.filter(center =>
        center.service_center_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        center.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Box sx={{ flexGrow: 1 }}>
            <NavBar />
            <Container style={{ marginTop: 40 }}>
                {/* Search Bar */}
                <Box sx={{ mb: 4 }}>
                    <TextField
                        fullWidth
                        label="Search by service center name or location"
                        variant="outlined"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </Box>

                {/* Service Centers List */}
                <Grid container spacing={4}>
                    {filteredCenters.map(center => (
                        <Grid item xs={12} md={6} key={center.id}>
                            <Paper elevation={3} sx={{ padding: 2 }}>
                                <Grid container spacing={2}>
                                    {/* Service Center Image */}
                                    <Grid item xs={12} sm={4}>
                                        <Box
                                            sx={{
                                                height: 150,
                                                backgroundImage: `url(http://localhost/animal_care_api/Service_Provider/${center.image})`,
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center',
                                            }}
                                        ></Box>
                                    </Grid>

                                    {/* Service Center Info */}
                                    <Grid item xs={12} sm={8}>
                                        <Typography variant="h6">{center.service_center_name}</Typography>
                                        <Typography variant="body1"><strong>Location:</strong> {center.location}</Typography>
                                        <Typography variant="body1"><strong>Service Type:</strong> 
                                            {Array.isArray(center.service_types) ? center.service_types.join(', ') : 'N/A'}
                                        </Typography>

                                        {/* Book an Appointment Button */}
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            sx={{ mt: 2 }}
                                            onClick={() => navigate(`/book-appointment/${center.id}`)}
                                        >
                                            Book an Appointment
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* Footer */}
            <Box sx={{ py: 4, backgroundColor: '#303030', color: 'white', textAlign: 'center', mt: 8 }}>
                <Typography variant="body2">© 2024 Hospital Name</Typography>
            </Box>
        </Box>
    );
};

export default Appointment;
