import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    CircularProgress,
    Container,
    Typography,
    Card,
    Box,
    CardContent,
    Grid,
    List,
    ListItem,
    ListItemText,
    Button,
    Alert,
} from "@mui/material";
import NavBar from '../../NavBar';

const MyAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [emergencyAppointments, setEmergencyAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Get user_id from local storage
        const userId = localStorage.getItem("UserID");

        if (!userId) {
            setError("User ID not found in local storage.");
            setLoading(false);
            return;
        }

        // Fetch data from the API
        const fetchAppointments = async () => {
            try {
                const response = await axios.get(
                    `http://localhost/animal_care_api/Appointment/get_all_appoinment_by_userid.php?user_id=${userId}`
                );

                const data = response.data;

                if (data.status === "success") {
                    setAppointments(data.appointments);
                    setEmergencyAppointments(data.emergency_appointments);
                } else {
                    setError("Failed to fetch appointments.");
                }
            } catch (error) {
                setError("An error occurred while fetching appointments.");
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, []);

    if (loading) {
        return (
            <Container>
                <CircularProgress />
                <Typography variant="body1">Loading...</Typography>
            </Container>
        );
    }

    if (error) {
        return (
            <Container>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
      <NavBar />
        <Container>
            <Typography variant="h4" gutterBottom>
                My Appointments
            </Typography>

            {/* Regular Appointments */}
            <Typography variant="h5" gutterBottom>
                Appointments
            </Typography>
            {appointments.length > 0 ? (
                <Grid container spacing={2}>
                    {appointments.map((appointment) => (
                        <Grid item xs={12} sm={6} md={4} key={appointment.id}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        {appointment.pet_name} ({appointment.pet_type})
                                    </Typography>
                                    <List>
                                        <ListItem>
                                            <ListItemText primary="Customer" secondary={appointment.customer_name} />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText primary="Service" secondary={appointment.service_type} />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText primary="Date" secondary={appointment.appointment_date} />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText primary="Time" secondary={appointment.appointment_time} />
                                        </ListItem>
                                    </List>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Typography variant="body1">No appointments found.</Typography>
            )}

            {/* Emergency Appointments */}
            <Typography variant="h5" gutterBottom>
                Emergency Appointments
            </Typography>
            {emergencyAppointments.length > 0 ? (
                <Grid container spacing={2}>
                    {emergencyAppointments.map((emergencyAppointment) => (
                        <Grid item xs={12} sm={6} md={4} key={emergencyAppointment.id}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Emergency Appointment
                                    </Typography>
                                    <List>
                                        <ListItem>
                                            <ListItemText primary="Customer" secondary={emergencyAppointment.customer_name} />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText primary="Time" secondary={emergencyAppointment.appointment_time} />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText
                                                primary="Meeting Link"
                                                secondary={
                                                    <a href={emergencyAppointment.google_meeting_link} target="_blank" rel="noopener noreferrer">
                                                        {emergencyAppointment.google_meeting_link}
                                                    </a>
                                                }
                                            />
                                        </ListItem>

                                        {/* <ListItem>
                      <ListItemText
                        primary="Meeting Link"
                        secondary={
                          <Button
                            href={emergencyAppointment.google_meeting_link}
                            target="_blank"
                            variant="contained"
                            color="primary"
                            size="small"
                          >
                            Join Meeting
                          </Button>
                        }
                      />
                    </ListItem> */}
                                        <ListItem>
                                            <ListItemText primary="Gender" secondary={emergencyAppointment.gender} />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText primary="Payment Status" secondary={emergencyAppointment.payment_status} />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText primary="Status" secondary={emergencyAppointment.status} />
                                        </ListItem>
                                    </List>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Typography variant="body1">No emergency appointments found.</Typography>
            )}
        </Container>
        </Box>
    );
};

export default MyAppointments;
