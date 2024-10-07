import React, { useEffect, useState } from 'react';
import { Grid, Typography, Card, Avatar, TextField, Button, Box } from '@mui/material';
import axios from 'axios';

const Profile = () => {
  const [doctor, setDoctor] = useState(null);

  // Fetch the doctor's details from the API using doctor_id from localStorage
  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        // Get doctor_id from localStorage
        const doctorId = localStorage.getItem('DoctorID');

        // Ensure doctorId exists before making the API request
        if (!doctorId) {
          console.error("DoctorID not found in localStorage");
          return;
        }

        const response = await axios.get('http://localhost/animal_care_api/Doctor/GetDoctorDetailsById.php', {
          params: { doctor_id: doctorId },
        });
        setDoctor(response.data.doctor);
      } catch (error) {
        console.error("Error fetching doctor details:", error);
      }
    };

    fetchDoctorDetails();
  }, []);

  if (!doctor) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ padding: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" align="center" gutterBottom>
            Doctor Profile Management
          </Typography>
        </Grid>

        {/* Profile Section */}
        <Grid item xs={12} sm={4}>
          <Card sx={{ padding: 3, textAlign: 'center', borderRadius: 3, boxShadow: 3 }}>
            {/* Placeholder profile image */}
            <Avatar
              src={`http://localhost/animal_care_api/Doctor/${doctor.profile_image}`}  
              sx={{ width: 100, height: 100, margin: '0 auto' }}
            />
            <Typography variant="h6" sx={{ marginTop: 2 }}>
              {doctor.full_name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {doctor.specialization}
            </Typography>
            <Button variant="outlined" sx={{ marginTop: 2 }}>
              Change Avatar
            </Button>
          </Card>
        </Grid>

        {/* Profile Information */}
        <Grid item xs={12} sm={8}>
          <Card sx={{ padding: 3, borderRadius: 3, boxShadow: 3 }}>
            <Typography variant="h6" gutterBottom>
              Edit Profile
            </Typography>
            <TextField
              label="Full Name"
              fullWidth
              margin="normal"
              defaultValue={doctor.full_name}
            />
            <TextField
              label="Email"
              fullWidth
              margin="normal"
              defaultValue={doctor.email}
            />
            <TextField
              label="Gender"
              fullWidth
              margin="normal"
              defaultValue={doctor.gender}
            />
            <TextField
              label="Date of Birth"
              fullWidth
              margin="normal"
              defaultValue={doctor.date_of_birth}
            />
            <TextField
              label="Phone Number"
              fullWidth
              margin="normal"
              defaultValue={doctor.phone_number}
            />
            <TextField
              label="Medical License Number"
              fullWidth
              margin="normal"
              defaultValue={doctor.medical_license_number}
            />
            <TextField
              label="Specialization"
              fullWidth
              margin="normal"
              defaultValue={doctor.specialization}
            />
            <TextField
              label="Years of Experience"
              fullWidth
              margin="normal"
              defaultValue={doctor.years_of_experience}
            />
            <TextField
              label="Qualifications"
              fullWidth
              margin="normal"
              defaultValue={doctor.qualifications}
            />
            <TextField
              label="Available Start Time"
              fullWidth
              margin="normal"
              defaultValue={doctor.available_start_time || 'N/A'}
            />
            <TextField
              label="Available End Time"
              fullWidth
              margin="normal"
              defaultValue={doctor.available_end_time || 'N/A'}
            />
            <Button variant="contained" color="primary" sx={{ marginTop: 2 }}>
              Save Changes
            </Button>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;
