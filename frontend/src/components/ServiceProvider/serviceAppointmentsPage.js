import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Typography, 
  Button, 
  CircularProgress 
} from '@mui/material';

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const serviceProviderId = localStorage.getItem('service_providerID');

    if (!serviceProviderId) {
      setError('Service Provider ID not found');
      setLoading(false);
      return;
    }

    axios
      .get(
        `http://localhost/animal_care_api/Appointment/book_appointment.php?serviceProviderId=${serviceProviderId}`
      )
      .then((response) => {
        console.log('API Response:', response.data); 

        if (response.data.status === 'success') {
          const appointmentData = response.data.data;

          if (Array.isArray(appointmentData)) {
            setAppointments(appointmentData); 
          } else if (appointmentData && typeof appointmentData === 'object') {
            setAppointments([appointmentData]);
          } else {
            setError('Unexpected response format');
          }
        } else {
          setError('Failed to fetch appointments');
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching appointments:', error);
        setError('Error fetching appointments');
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return <Typography variant="h6" color="error">{error}</Typography>;
  }

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Booked Appointments
      </Typography>
      <Button variant="contained" color="primary" onClick={handleLogout}>
        Logout
      </Button>

      {appointments.length > 0 ? (
        <TableContainer component={Paper} style={{ marginTop: 20 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Customer Name</TableCell>
                <TableCell>Pet Type</TableCell>
                <TableCell>Pet Name</TableCell>
                <TableCell>Service Type</TableCell>
                <TableCell>Appointment Date</TableCell>
                <TableCell>Appointment Time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>{appointment.id}</TableCell>
                  <TableCell>{appointment.customer_name}</TableCell>
                  <TableCell>{appointment.pet_type}</TableCell>
                  <TableCell>{appointment.pet_name}</TableCell>
                  <TableCell>{appointment.service_type}</TableCell>
                  <TableCell>{appointment.appointment_date}</TableCell>
                  <TableCell>{appointment.appointment_time}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="h6">No appointments found</Typography>
      )}
    </div>
  );
};

export default AppointmentsPage;
