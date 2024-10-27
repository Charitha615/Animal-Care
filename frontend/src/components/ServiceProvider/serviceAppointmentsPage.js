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
  CircularProgress,
  Box,
  Card,
  CardContent,
  CardMedia,
  TextField,
  Stack,
  MenuItem
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledTableContainer = styled(TableContainer)({
  marginTop: 20,
  borderRadius: 8,
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
});

const StyledTableCell = styled(TableCell)({
  fontWeight: 'bold',
  color: '#3f51b5',
  textTransform: 'uppercase',
  fontSize: '0.875rem',
});

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.selected,
  },
}));



const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const serviceProviderId = localStorage.getItem('service_providerID');

    if (!serviceProviderId) {
      setError('Service Provider ID not found');
      setLoading(false);
      return;
    }

    // Fetch Appointments
    axios
      .get(
        `http://localhost/animal_care_api/Appointment/book_appointment.php?serviceProviderId=${serviceProviderId}`
      )
      .then((response) => {
        if (response.data.status === 'success') {
          const appointmentData = response.data.data;
          setAppointments(Array.isArray(appointmentData) ? appointmentData : [appointmentData]);
        } else {
          setError('Failed to fetch appointments');
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Error fetching appointments');
        setLoading(false);
      });

    // Fetch Profile Data
    axios
      .get(`http://localhost/animal_care_api/Service_Provider/get_all_service_providers.php?id=${serviceProviderId}`)
      .then((response) => {
        if (response.data.status === 'success') {
          setProfile(response.data.data);
        } else {
          setError('Failed to fetch profile data');
        }
      })
      .catch(() => setError('Error fetching profile data'));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  // Filtered appointments based on search and filterStatus
  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch = appointment.customer_name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus =
      filterStatus === 'all' || appointment.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const updateAppointmentStatus = (appointmentId) => {
    axios
      .patch('http://localhost/animal_care_api/Appointment/update_appointment_status.php', {
        appointmentId: appointmentId,
        status: 'completed',
      })
      .then((response) => {
        if (response.data.status === 'success') {
          setAppointments((prevAppointments) =>
            prevAppointments.map((appointment) =>
              appointment.id === appointmentId ? { ...appointment, status: 'completed' } : appointment
            )
          );
        } else {
          alert('Failed to update appointment status');
        }
      })
      .catch(() => {
        alert('Error updating appointment status');
      });
  };


  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box padding={3}>
      {profile && (

        <Card sx={{ mb: 3, p: 3, display: 'flex', alignItems: 'center', boxShadow: 3, borderRadius: 2 }}>
          <CardMedia
            component="img"
            src={`http://localhost/animal_care_api/Service_Provider/${profile.image}`}
            alt="Service Provider"
            sx={{ width: 250, height: 250, borderRadius: '50%', mr: 3 }}
          />
          <CardContent style={{ textAlign: "center", marginLeft: 450 }}>
            <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', mb: 1, color: 'primary.main' }}>
              {profile.service_center_name}
            </Typography>
            <Stack spacing={1.5}>
              <Typography variant="body2">
                <strong>Owner:</strong> {profile.owner_name}
              </Typography>
              <Typography variant="body2">
                <strong>Location:</strong> {profile.location}
              </Typography>
              <Typography variant="body2">
                <strong>Phone:</strong> {profile.phone_no}
              </Typography>
              <Typography variant="body2">
                <strong>Email:</strong> {profile.email}
              </Typography>
              <Typography variant="body2">
                <strong>NIC:</strong> {profile.nic}
              </Typography>
              <Typography variant="body2">
                <strong>Services:</strong> {profile.service_types.join(', ')}
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      )}

      <Typography variant="h4" gutterBottom align="center">
        My Booked Appointments
      </Typography>
      <Box display="flex" justifyContent="space-between" marginBottom={5} marginTop={5}>
        <TextField
          label="Search by Customer Name"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 550 }}
        />
        <TextField
          select
          label="Filter by Status"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          variant="outlined"
          style={{ width: 550 }}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
          <MenuItem value="not_completed">Not Completed</MenuItem>
        </TextField>
        <Button variant="contained" color="primary" onClick={handleLogout}>
          Logout
        </Button>
      </Box>

      {appointments.length > 0 ? (
        <StyledTableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>ID</StyledTableCell>
                <StyledTableCell>Customer Name</StyledTableCell>
                <StyledTableCell>Pet Type</StyledTableCell>
                <StyledTableCell>Pet Name</StyledTableCell>
                <StyledTableCell>Service Type</StyledTableCell>
                <StyledTableCell>Appointment Date</StyledTableCell>
                <StyledTableCell>Appointment Time</StyledTableCell>
                <StyledTableCell>Status</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAppointments.map((appointment) => (
                <StyledTableRow key={appointment.id}>
                  <TableCell>{appointment.id}</TableCell>
                  <TableCell>{appointment.customer_name}</TableCell>
                  <TableCell>{appointment.pet_type}</TableCell>
                  <TableCell>{appointment.pet_name}</TableCell>
                  <TableCell>{appointment.service_type}</TableCell>
                  <TableCell>{appointment.appointment_date}</TableCell>
                  <TableCell>{appointment.appointment_time}</TableCell>
                  <TableCell>
                    <Typography
                      component="span"
                      style={{
                        color: appointment.status === 'not_completed' ? 'red' : 'green',
                        fontWeight: 'bold',
                      }}
                    >
                      {appointment.status === 'not_completed' ? 'Not Completed' : 'Completed'}
                    </Typography>
                    {appointment.status === 'not_completed' && (
                       <Button
                       variant="contained"
                       color="primary"
                       size="small"
                       style={{ marginLeft: 10 }}
                       onClick={() => updateAppointmentStatus(appointment.id)}
                     >
                       Mark as Completed
                     </Button>
                    )}
                  </TableCell>
                </StyledTableRow>
              ))}
            </TableBody>

          </Table>
        </StyledTableContainer>
      ) : (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="50vh"
        >
          <Card>
            <CardContent>
              <Typography variant="h6" align="center">
                No appointments found
              </Typography>
            </CardContent>
          </Card>
        </Box>
      )}
    </Box>
  );
};

export default AppointmentsPage;
