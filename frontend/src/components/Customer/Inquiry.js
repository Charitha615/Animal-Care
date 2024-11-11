import React, { useState } from 'react';
import { Box, Container, Typography, TextField, Button, Grid } from '@mui/material';
import NavBar from "../../NavBar";
import Swal from 'sweetalert2';

const Inquiry = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const [statusMessage, setStatusMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Get user ID from localStorage
        const user_id = localStorage.getItem('UserID');
        if (!user_id) {
            setStatusMessage('User ID not found. Please log in.');
            return;
        }

        // Prepare the data to be sent
        const data = {
            user_id,
            ...formData,
        };

        try {
            const response = await fetch('http://localhost/animal_care_api/Inquiry/store_inquiry.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            if (response.ok) {
                Swal.fire('Success', `Inquiry submitted successfully! We will provide a quick response. Please check your email: ${formData.email}`, 'success');


                setFormData({
                    name: '',
                    email: '',
                    subject: '',
                    message: '',
                });
            } else {
                Swal.fire('Error', result.message || 'Failed to submit inquiry', 'error');
            }
        } catch (error) {
            console.error('Error submitting inquiry:', error);
            setStatusMessage('An error occurred while submitting the inquiry');
        }
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <NavBar /> {/* Use the NavBar component */}
            <Container maxWidth="sm" sx={{ mt: 8 }}>
                <Box
                    sx={{
                        p: 4,
                        boxShadow: 3,
                        borderRadius: 2,
                        bgcolor: 'background.paper',
                    }}
                >
                    <Typography variant="h4" align="center" gutterBottom>
                        Inquiry Form
                    </Typography>
                    <Typography variant="body1" align="center" color="textSecondary" gutterBottom>
                        Fill out the form below and we'll get back to you soon.
                    </Typography>
                    {statusMessage && (
                        <Typography
                            variant="body2"
                            align="center"
                            color="textSecondary"
                            sx={{ mb: 2 }}
                        >
                            {statusMessage}
                        </Typography>
                    )}
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    variant="outlined"
                                    type="email"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    variant="outlined"
                                    multiline
                                    rows={4}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    fullWidth
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    sx={{ mt: 2 }}
                                >
                                    Submit
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Box>
            </Container>
        </Box>
    );
};

export default Inquiry;
