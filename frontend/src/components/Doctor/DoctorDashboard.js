import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Paper, Container, Button, Avatar, Card, CardContent, Modal, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
} from '@mui/material';
// import NavBar from '../../NavBar'; 
import axios from 'axios'; // To make API calls
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import WorkIcon from '@mui/icons-material/Work';
import BadgeIcon from '@mui/icons-material/Badge';
import ExperienceIcon from '@mui/icons-material/WorkspacePremium';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

const DoctorDashboard = () => {
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [availableStartTime, setAvailableStartTime] = useState('');
  const [availableEndTime, setAvailableEndTime] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [patients, setPatients] = useState([]);
  const [showPatientTable, setShowPatientTable] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [open, setOpen] = useState(false); // Modal state
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [emergencyAppointment, setEmergencyAppointment] = useState(null); // Emergency Appointment State
  const [openEmergencyModal, setOpenEmergencyModal] = useState(false); // Modal for Emergency Appointments
  const [emergencyAppointments, setEmergencyAppointments] = useState([]);
  const navigate = useNavigate();

  // Fetch doctor details on page load
  useEffect(() => {
    // Get doctor_id from localStorage
    const doctorId = localStorage.getItem('DoctorID');

    if (doctorId) {
      axios.get(`http://localhost/animal_care_api/Doctor/GetDoctorDetailsById.php?doctor_id=${doctorId}`)
        .then(response => {
          if (response.data.status === 'success') {
            setDoctorDetails(response.data.doctor);
            setAvailableStartTime(response.data.doctor.available_start_time || '');
            setAvailableEndTime(response.data.doctor.available_end_time || '');
          } else {
            console.error('Failed to fetch doctor details');
          }
        })
        .catch(error => console.error('Error fetching doctor details:', error));
    } else {
      console.error('DoctorID not found in localStorage');
    }
  }, []);

  // Fetch Emergency Appointments
  useEffect(() => {
    const fetchEmergencyAppointments = () => {
      // Get doctor_id from localStorage
      const doctorId = localStorage.getItem('DoctorID');

      if (doctorId) {
        axios.post('http://localhost/animal_care_api/Appointment/EmergencyAppointmentAPI.php', {
          action: 'get_emergency_appointments_by_doctor',
          doctor_id: doctorId,
        })
          .then(response => {
            if (response.data.status === 'success' && response.data.data.length > 0) {
              setEmergencyAppointment(response.data.data[0]);
              setOpenEmergencyModal(true);
            } else {
              setEmergencyAppointment(null);
            }
          })
          .catch(error => console.error('Error fetching emergency appointments:', error));
      } else {
        console.error('DoctorID not found in localStorage');
      }
    };

    fetchEmergencyAppointments();
    const intervalId = setInterval(fetchEmergencyAppointments, 10000); // Poll every 30 seconds
    return () => clearInterval(intervalId);
  }, []);


  // Fetch Patients
  useEffect(() => {
    axios.get('http://localhost/animal_care_api/Doctor/GetPatients.php')
      .then(response => {
        setPatients(response.data);
        setFilteredPatients(response.data);
      })
      .catch(error => console.error('Error fetching patient data:', error));
  }, []);

  // Fetch Appointments by Patient ID
  const fetchAppointments = (patientId) => {
    axios.get(`http://localhost/animal_care_api/Doctor/GetAppointments.php?patient_id=${patientId}`)
      .then(response => {
        setAppointments(response.data);
        setOpen(true);
      })
      .catch(error => console.error('Error fetching appointment data:', error));
  };

  // Handle updating availability
  const handleUpdateAvailability = () => {

    const doctorId = localStorage.getItem('DoctorID');

    axios.post('http://localhost/animal_care_api/Doctor/UpdateDoctorAvailability.php', {
      doctor_id: doctorId,
      available_start_time: availableStartTime,
      available_end_time: availableEndTime,
    })
      .then(response => {
        if (response.data.status === 'success') {
          alert('Availability updated successfully!');
          setIsEditing(false);
        } else {
          alert('Failed to update availability');
        }
      })
      .catch(error => console.error('Error updating availability:', error));
  };

  // Handle search input change
  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);
    const filtered = patients.filter(patient =>
      patient.username.toLowerCase().includes(searchValue) || String(patient.id).includes(searchValue)
    );
    setFilteredPatients(filtered);
  };

  // Handle Close Modal
  const handleClose = () => setOpen(false);

  // Mark Emergency Appointment as Done
  const handleMarkAsDone = () => {
    axios.post('http://localhost/animal_care_api/Appointment/EmergencyAppointmentAPI.php', {
      action: 'update_appointment_status',
      appointment_id: emergencyAppointment.id,
      status: 'Done',
    })
      .then(response => {
        if (response.data.status === 'success') {
          setOpenEmergencyModal(false);
          alert('Appointment marked as done!');
          setEmergencyAppointment(null);
        } else {
          alert('Failed to mark appointment as done');
        }
      })
      .catch(error => console.error('Error marking appointment as done:', error));
  };

  const fetchEmergencyAppointments = () => {
    const doctorId = localStorage.getItem('DoctorID');
    if (doctorId) {
      axios.post('http://localhost/animal_care_api/Appointment/EmergencyAppointmentAPI.php', {
        action: 'get_emergency_appointments_all_by_doctor',
        doctor_id: doctorId,
      })
        .then(response => {
          if (response.data.status === 'success') {
            setEmergencyAppointments(response.data.data);
            setOpenEmergencyModal(true);
          } else {
            console.error('Failed to fetch emergency appointments');
          }
        })
        .catch(error => console.error('Error fetching emergency appointments:', error));
    } else {
      console.error('DoctorID not found in localStorage');
    }
  };

  // Handle closing the emergency appointments modal
  const handleCloseEmergencyModal = () => setOpenEmergencyModal(false);

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* <NavBar /> */}
      <Box sx={{ py: 8, backgroundColor: '#f7f7f7' }}>
        <Container>
          <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
            <Typography variant="h4">Doctor Dashboard</Typography>
            <Button variant="contained" color="secondary" startIcon={<LogoutIcon />} onClick={() => navigate('/login')}>
              Logout
            </Button>
          </Grid>

          {/* Doctor Details */}
          {doctorDetails ? (
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Card sx={{ maxWidth: 800, margin: 'auto', borderRadius: 3 }}>
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={4} display="flex" justifyContent="center">
                        <Avatar
                          alt={doctorDetails.full_name}
                          src={doctorDetails.avatarUrl || `http://localhost/animal_care_api/Doctor/${doctorDetails.profile_image}`}
                          sx={{ width: 150, height: 150 }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={8}>
                        <Typography variant="h5">{doctorDetails.full_name}</Typography>
                        <Grid container spacing={1} alignItems="center">
                          <Grid item><EmailIcon /></Grid>
                          <Grid item><Typography>{doctorDetails.email}</Typography></Grid>
                        </Grid>
                        <Grid container spacing={1} alignItems="center">
                          <Grid item><PhoneIcon /></Grid>
                          <Grid item><Typography>{doctorDetails.phone_number}</Typography></Grid>
                        </Grid>
                        <Grid container spacing={1} alignItems="center">
                          <Grid item><WorkIcon /></Grid>
                          <Grid item><Typography>Specialization: {doctorDetails.specialization}</Typography></Grid>
                        </Grid>
                        <Grid container spacing={1} alignItems="center">
                          <Grid item><BadgeIcon /></Grid>
                          <Grid item><Typography>License: {doctorDetails.medical_license_number}</Typography></Grid>
                        </Grid>
                        <Grid container spacing={1} alignItems="center">
                          <Grid item><ExperienceIcon /></Grid>
                          <Grid item><Typography>Experience: {doctorDetails.years_of_experience} years</Typography></Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Availability Section */}
              <Grid item xs={12} md={6}>
                <Paper elevation={3} sx={{ padding: 3 }}>
                  <Typography variant="h6">Availability</Typography>
                  {isEditing ? (
                    <div>
                      <TextField
                        label="Start Time"
                        type="time"
                        value={availableStartTime}
                        onChange={(e) => setAvailableStartTime(e.target.value)}
                        fullWidth
                        margin="normal"
                      />
                      <TextField
                        label="End Time"
                        type="time"
                        value={availableEndTime}
                        onChange={(e) => setAvailableEndTime(e.target.value)}
                        fullWidth
                        margin="normal"
                      />
                      <Button variant="contained" color="primary" onClick={handleUpdateAvailability} sx={{ mt: 2 }}>
                        Save
                      </Button>
                      <Button variant="outlined" color="secondary" onClick={() => setIsEditing(false)} sx={{ mt: 2, ml: 2 }}>
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <Typography variant="body1">Start Time: {availableStartTime || 'Not Set'}</Typography>
                      <Typography variant="body1">End Time: {availableEndTime || 'Not Set'}</Typography>
                      <Button variant="contained" color="primary" onClick={() => setIsEditing(true)} sx={{ mt: 2 }}>
                        Edit Availability
                      </Button>
                    </div>
                  )}
                </Paper>
              </Grid>
            </Grid>
          ) : (
            <Typography>Loading doctor details...</Typography>
          )}

          {/* Emergency Appointment Modal */}
          {emergencyAppointment && (
            <Modal
              open={openEmergencyModal}
              onClose={() => setOpenEmergencyModal(false)}
              aria-labelledby="emergency-appointment-modal"
            >
              <Box sx={{
                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 2,
              }}>
                <Typography variant="h6">Emergency Appointment Alert</Typography>
                <Typography><strong>Customer Name:</strong> {emergencyAppointment.customer_name}</Typography>
                <Typography><strong>Appointment Time:</strong> {emergencyAppointment.appointment_time}</Typography>
                <Typography><strong>Meeting Link:</strong> <a href={emergencyAppointment.google_meeting_link} target="_blank" rel="noopener noreferrer">{emergencyAppointment.google_meeting_link}</a></Typography>

                <Button variant="contained" color="primary" onClick={handleMarkAsDone} sx={{ mt: 2 }}>
                  Mark as Done
                </Button>
              </Box>
            </Modal>
          )}

          {/* Rest of the Dashboard */}
          <Grid container spacing={2} sx={{ marginTop: 4 }}>
            <Grid item xs={12} sm={4}>
              <Card sx={{ textAlign: 'center', padding: 2, borderRadius: 3, boxShadow: 3 }}>
                <Typography variant="h6">Profile Management</Typography>
                <Typography variant="body2" color="textSecondary">Manage your profile and credentials.</Typography>
                <Button variant="contained" color="primary" sx={{ marginTop: 2 }} onClick={() => navigate('/doctor/profile')}>
                  GO TO PROFILE
                </Button>
              </Card>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Card sx={{ textAlign: 'center', padding: 2, borderRadius: 3, boxShadow: 3 }}>
                <Typography variant="h6">Emergency Appointments</Typography>
                <Typography variant="body2" color="textSecondary">Handle emergency appointments efficiently.</Typography>
                <Button variant="contained" color="primary" sx={{ marginTop: 2 }}  onClick={fetchEmergencyAppointments}>
                  EMERGENCY APPOINTMENTS
                </Button>
              </Card>
            </Grid>
          </Grid>

          {/* Emergency Appointments Modal */}
          <Modal open={openEmergencyModal} onClose={handleCloseEmergencyModal}>
            <Box sx={{
              position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
              bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 2, width: '80%',
            }}>
              <Typography variant="h6">Emergency Appointments</Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Customer Name</TableCell>
                      <TableCell>Appointment Time</TableCell>
                      <TableCell>Meet Link</TableCell>
                      <TableCell>Payment Status</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {emergencyAppointments.length > 0 ? (
                      emergencyAppointments.map((appointment) => (
                        <TableRow key={appointment.id}>
                          <TableCell>{appointment.customer_name}</TableCell>
                          <TableCell>{appointment.appointment_time}</TableCell>
                          <TableCell>{appointment.google_meeting_link}</TableCell>
                          <TableCell>{appointment.payment_status}</TableCell>
                          <TableCell>{appointment.status}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} align="center">No emergency appointments</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Modal>

        </Container>
      </Box>
    </Box>
  );
};

export default DoctorDashboard;
