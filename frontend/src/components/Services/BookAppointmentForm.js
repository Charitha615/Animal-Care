import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, TextField, Container, MenuItem, Grid } from '@mui/material';
import NavBar from '../../NavBar'; // Import the NavBar
import axios from 'axios'; // You need axios to make API requests
import { useParams } from 'react-router-dom'; // Import useParams to get serviceProviderId from URL
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const BookAppointment = () => {
    const navigate = useNavigate();
    // Extract serviceProviderId from the URL
    const { serviceProviderId } = useParams();
    const userId = localStorage.getItem('UserID');

    // Form states
    const [formValues, setFormValues] = useState({
        user_id: userId,
        customerName: '',
        petType: '',
        petName: '',
        serviceType: [],
        date: '',
        time: '',
        serviceProviderId: serviceProviderId
    });

    const [serviceTypes, setServiceTypes] = useState([]);

    // Options for pet type
    const petTypes = ['Dog', 'Cat', 'Bird', 'Other'];

    // Fetch service types from the API when the component mounts
    useEffect(() => {
        const fetchServiceTypes = async () => {
            try {
                const response = await axios.get(`http://localhost/animal_care_api/Service_Provider/get_all_service_providers.php?id=${serviceProviderId}`);
                setServiceTypes(response.data.data.service_types); // Assuming the API returns the list here
            } catch (error) {
                console.error("Error fetching service types:", error);
            }
        };

        fetchServiceTypes();
    }, [serviceProviderId]);

    // Handle input changes
    const handleChange = (event) => {
        const { name, value } = event.target;

        if (name === 'serviceType') {
            setFormValues({
                ...formValues,
                serviceType: typeof value === 'string' ? value.split(',') : value, // For multiple select
            });
        } else {
            setFormValues({
                ...formValues,
                [name]: value,
            });
        }
    };

    // Handle form submission
    const handleConfirm = async () => {
        console.log('Appointment Confirmed', formValues);

        try {
            // Send data to the API after confirming the form
            const response = await axios.post('http://localhost/animal_care_api/Appointment/book_appointment.php', {
                ...formValues,
                serviceProviderId // Send the serviceProviderId with form values
            });

            // Check if the response status indicates an error
            if (response.data.status === "error") {  // Corrected "error" to be a string
                Swal.fire({
                    icon: 'error',
                    title: 'Failed to book the appointment',
                    text: response.data.message,
                });
                return;  // Exit early if there's an error
            }

            // Show success message using SweetAlert2
            Swal.fire({
                icon: 'success',
                title: 'Appointment booked successfully!',
                showConfirmButton: false,
                timer: 1500
            }).then(() => {
                // Redirect to /appointment after success
                navigate('/appointment'); // Uncomment and make sure navigate is defined
            });

        } catch (error) {
            console.error("Error submitting the form:", error);

            // Show error message using SweetAlert2
            Swal.fire({
                icon: 'error',
                title: 'Failed to book the appointment',
                text: 'Please try again later',
            });
        }
    };


    // Clear the form
    const handleClear = () => {
        setFormValues({
            customerName: '',
            petType: '',
            petName: '',
            serviceType: [],
            date: '',
            time: ''
        });
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <NavBar />
            <Container sx={{ py: 8 }}>
                <Typography variant="h4" gutterBottom>
                    Book an Appointment
                </Typography>

                {/* Appointment Form */}
                <Box component="form" sx={{ mt: 4 }}>
                    <Grid container spacing={3}>
                        {/* Customer Name */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Customer Name"
                                variant="outlined"
                                name="customerName"
                                value={formValues.customerName}
                                onChange={handleChange}
                            />
                        </Grid>

                        {/* Pet Type */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                select
                                label="Pet Type"
                                variant="outlined"
                                name="petType"
                                value={formValues.petType}
                                onChange={handleChange}
                            >
                                {petTypes.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        {/* Pet Name */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Pet Name"
                                variant="outlined"
                                name="petName"
                                value={formValues.petName}
                                onChange={handleChange}
                            />
                        </Grid>

                        {/* Service Type */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                select
                                label="Service Type"
                                variant="outlined"
                                name="serviceType"
                                value={formValues.serviceType}
                                onChange={handleChange}
                                SelectProps={{
                                    multiple: true
                                }}
                            >
                                {serviceTypes.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        {/* Date */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Date"
                                variant="outlined"
                                type="date"
                                name="date"
                                value={formValues.date}
                                onChange={handleChange}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>

                        {/* Time */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Time"
                                variant="outlined"
                                type="time"
                                name="time"
                                value={formValues.time}
                                onChange={handleChange}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>

                        {/* Confirm and Clear Buttons */}
                        <Grid item xs={12} sx={{ textAlign: 'center' }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleConfirm}
                                sx={{ mr: 2 }}
                            >
                                Confirm
                            </Button>
                            <Button variant="outlined" color="secondary" onClick={handleClear}>
                                Clear
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </Box>
    );
};

export default BookAppointment;
