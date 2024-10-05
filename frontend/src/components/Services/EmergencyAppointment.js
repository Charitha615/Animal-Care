import React, { useState, useEffect } from 'react';
import {
  Divider,
  Paper,
  Box,
  Button,
  Typography,
  Grid,
  Container,
  TextField,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Link,
  CircularProgress,
} from '@mui/material';
import NavBar from '../../NavBar'; // Import the NavBar
import axios from 'axios';
import Swal from 'sweetalert2';
import moment from 'moment'; // Import moment.js to handle time

const EmergencyAppointment = () => {
  const [openDialog, setOpenDialog] = useState(false); // Dialog state
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [gender, setGender] = useState('');
  const [fullName, setFullName] = useState('');
  const [doctors, setDoctors] = useState([]); // New state for storing doctors
  const [selectedDoctorId, setSelectedDoctorId] = useState(null); // To store selected doctor ID
  const [doctorSelected, setDoctorSelected] = useState(false); // To track if a doctor is selected

  // Handle dialog open and close
  const handleOpenDialog = () => {
    if (selectedDoctorId) {
      setOpenDialog(true);
    } else {
      Swal.fire({
        title: 'No Doctor Selected',
        text: 'Please select a doctor before booking an emergency appointment.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setPaymentConfirmed(false); // Reset payment state when dialog closes
  };

  // Get current time
  const getCurrentTime = () => {
    const now = moment(); // Use moment to get the current time
    return now;
  };

  // Function to check if doctor is available
  const isDoctorAvailable = (startTime, endTime) => {
    const now = getCurrentTime();
    const start = moment(startTime, 'HH:mm:ss'); // Convert start time to moment
    const end = moment(endTime, 'HH:mm:ss'); // Convert end time to moment

    return now.isBetween(start, end); // Check if current time is between start and end
  };

  // Handle Payment Process
  const handlePayment = async () => {
    if (!selectedDoctorId) {
      Swal.fire({
        title: 'Error',
        text: 'No doctor selected or available.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return;
    }

    setLoading(true);

    const userId = localStorage.getItem('UserID'); 
    const googleMeetingLink = 'https://meet.google.com/tqe-gzex-gxv'; 
    const paymentStatus = 'Completed';
    const status = 'NotDone';
    const appointmentTime = getCurrentTime().format('YYYY-MM-DD HH:mm:ss'); 

    const payload = {
      action: 'register_emergency_appointment',
      user_id: userId,
      appointment_time: appointmentTime,
      google_meeting_link: googleMeetingLink,
      gender: gender,
      payment_status: paymentStatus,
      doctor_id: selectedDoctorId, 
      status: status, 
    };

    try {
      setOpenDialog(false);
      setPaymentConfirmed(false);
      const response = await axios.post('http://localhost/animal_care_api/Appointment/EmergencyAppointmentAPI.php', payload);
      console.log(response.data.status);
      if (response.data.status === 'success') {
        setPaymentConfirmed(true);
        Swal.fire({
          title: 'Payment Successful!',
          html: `Your emergency appointment has been booked. <br> <a href="${googleMeetingLink}" target="_blank">Join the Meeting</a>`,
          icon: 'success',
          confirmButtonText: 'OK',
        });
      } else {
        Swal.fire({
          title: 'Error',
          text: response.data.message || 'Failed to book the appointment.',
          icon: 'error',
          confirmButtonText: 'Try Again',
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'An error occurred while processing your request.',
        icon: 'error',
        confirmButtonText: 'Try Again',
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch doctors data from API
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get('http://localhost/animal_care_api/Doctor/GetAllDoctors.php');
        if (response.data.status === 'success') {
          setDoctors(response.data.doctors); // Set doctors data
        } else {
          console.error('Failed to fetch doctors');
        }
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    };

    fetchDoctors();
  }, []);

  const selectDoctor = (doctorId) => {
    setSelectedDoctorId(doctorId);
    setDoctorSelected(true);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <NavBar />

      <Container style={{ marginTop: 40 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                height: 400,
                backgroundImage:
                  'url(https://media.istockphoto.com/id/922551734/vector/medical-white-cross.jpg?s=612x612&w=0&k=20&c=d65GPwOOyRVlFEPNSu8_Q7KdF1-CQmT4SZpN6nVUIZI=)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            ></Box>
          </Grid>

          <Grid item xs={12} md={8}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" gutterBottom>
                24-Hour Emergency Services
              </Typography>
              <Typography variant="body1" paragraph>
                We provide around-the-clock emergency services for your pets with highly trained professionals available at all times.
              </Typography>
              {/* Main "Book Emergency Appointment" Button */}
              <Button
                variant="contained"
                color="secondary"
                size="large"
                onClick={handleOpenDialog} // Open dialog when clicked
                sx={{ mt: 4 }}
              >
                Book Emergency Appointment
              </Button>
            </Box>
          </Grid>
        </Grid>

        {/* Our Team Section */}
        <Box sx={{ py: 8 }}>
          <Typography variant="h5" align="center" gutterBottom>
            Our Team
          </Typography>
          <Divider sx={{ mb: 4, width: '60%', margin: '0 auto' }} />
          <Grid container spacing={4} justifyContent="center">
            {doctors.length > 0 ? (
              doctors.map((doctor) => {
                const available = isDoctorAvailable(doctor.available_start_time, doctor.available_end_time);

                return (
                  <Grid item xs={12} sm={4} key={doctor.id}>
                    <Paper
                      elevation={3}
                      sx={{
                        padding: 2,
                        textAlign: 'center',
                        border: available ? '3px solid green' : 'none', 
                      }}
                      onClick={() => selectDoctor(doctor.id)}
                    >
                      <Box
                        sx={{
                          height: 150,
                          backgroundImage:
                            'url(https://hips.hearstapps.com/hmg-prod/images/portrait-of-a-happy-young-doctor-in-his-clinic-royalty-free-image-1661432441.jpg)', // Replace with doctor image
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          mb: 2,
                        }}
                      ></Box>
                      <Typography variant="h6">{doctor.full_name}</Typography>
                      <Typography variant="body2">Specialization: {doctor.specialization}</Typography>
                      <Typography variant="body2">Experience: {doctor.years_of_experience} years</Typography>
                      <Typography variant="body2">
                        Available: {doctor.available_start_time} - {doctor.available_end_time}
                      </Typography>

                      {available ? (
                        <Typography color="primary">Doctor Available</Typography>
                      ) : (
                        <Typography color="error">Doctor Unavailable</Typography>
                      )}
                    </Paper>
                  </Grid>
                );
              })
            ) : (
              <Typography>No doctors available at the moment.</Typography>
            )}
          </Grid>
        </Box>
      </Container>

      {/* Dialog for Emergency Appointment */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Emergency Appointment Payment</DialogTitle>
        <DialogContent>
          {!paymentConfirmed ? (
            <Box>
              {/* Payment Form */}
              <form style={{ marginTop: 20 }}>
                <Typography variant="h6" gutterBottom>
                  Payment Form
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Full Name"
                      fullWidth
                      variant="outlined"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField label="Nick Name" fullWidth variant="outlined" />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField label="Email Address" fullWidth variant="outlined" type="email" required />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField label="Date of Birth" fullWidth variant="outlined" placeholder="DD/MM/YYYY" />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl component="fieldset" fullWidth>
                      <Typography>Gender</Typography>
                      <RadioGroup row value={gender} onChange={(e) => setGender(e.target.value)}>
                        <FormControlLabel value="Male" control={<Radio />} label="Male" />
                        <FormControlLabel value="Female" control={<Radio />} label="Female" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField label="Card Number" fullWidth variant="outlined" type="number" required />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField label="Card CVC" fullWidth variant="outlined" type="number" required />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField label="Expiry Date (MM/YY)" fullWidth variant="outlined" placeholder="MM/YY" />
                  </Grid>
                </Grid>
                <Box sx={{ textAlign: 'center', marginTop: 4 }}>
                  <Button variant="contained" color="primary" onClick={handlePayment} fullWidth disabled={loading}>
                    {loading ? <CircularProgress size={24} /> : 'PAY NOW'}
                  </Button>
                </Box>
              </form>
            </Box>
          ) : (
            <Box>
              <Typography>
                Payment successful! Please join the emergency appointment via the Google Meet link below:
              </Typography>
              <Link href="https://meet.google.com/tqe-gzex-gxv" target="_blank" rel="noopener" sx={{ mt: 2 }}>
                https://meet.google.com/tqe-gzex-gxv
              </Link>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EmergencyAppointment;
