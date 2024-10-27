import React, { useEffect, useState } from 'react';
import { Grid, Typography, Card, Avatar, TextField, Button, Box } from '@mui/material';
import axios from 'axios';

const Profile = () => {
  const [doctor, setDoctor] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [profileImage, setProfileImage] = useState(null);

  // Fetch the doctor's details from the API using doctor_id from localStorage
  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const doctorId = localStorage.getItem('DoctorID');

        if (!doctorId) {
          console.error("DoctorID not found in localStorage");
          return;
        }

        const response = await axios.get('http://localhost/animal_care_api/Doctor/GetDoctorDetailsById.php', {
          params: { doctor_id: doctorId },
        });
        setDoctor(response.data.doctor);
        setFormValues(response.data.doctor);
      } catch (error) {
        console.error("Error fetching doctor details:", error);
      }
    };

    fetchDoctorDetails();
  }, []);

  // Handle form input changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  // Handle profile image upload
  const handleImageChange = (event) => {
    setProfileImage(event.target.files[0]);
  };

  // Submit the form to update doctor details
  const handleFormSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("doctor_id", localStorage.getItem('DoctorID'));
      for (const key in formValues) {
        formData.append(key, formValues[key]);
      }

      if (profileImage) {
        formData.append("profile_image", profileImage);
      }

      await axios.post('http://localhost/animal_care_api/Doctor/update_doctor.php', formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      alert("Doctor profile updated successfully");
    } catch (error) {
      console.error("Error updating doctor profile:", error);
      alert("Error updating profile");
    }
  };

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
            <Button variant="outlined" sx={{ marginTop: 2 }} component="label">
              Change Avatar
              <input type="file" hidden onChange={handleImageChange} />
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
              name="full_name"
              value={formValues.full_name || ''}
              onChange={handleInputChange}
            />
            <TextField
              label="Email"
              fullWidth
              margin="normal"
              name="email"
              value={formValues.email || ''}
              onChange={handleInputChange}
            />
            <TextField
              label="Gender"
              fullWidth
              margin="normal"
              name="gender"
              value={formValues.gender || ''}
              onChange={handleInputChange}
            />
            <TextField
              label="Date of Birth"
              fullWidth
              margin="normal"
              name="date_of_birth"
              value={formValues.date_of_birth || ''}
              onChange={handleInputChange}
            />
            <TextField
              label="Phone Number"
              fullWidth
              margin="normal"
              name="phone_number"
              value={formValues.phone_number || ''}
              onChange={handleInputChange}
            />
            <TextField
              label="Medical License Number"
              fullWidth
              margin="normal"
              name="medical_license_number"
              value={formValues.medical_license_number || ''}
              onChange={handleInputChange}
            />
            <TextField
              label="Specialization"
              fullWidth
              margin="normal"
              name="specialization"
              value={formValues.specialization || ''}
              onChange={handleInputChange}
            />
            <TextField
              label="Years of Experience"
              fullWidth
              margin="normal"
              name="years_of_experience"
              value={formValues.years_of_experience || ''}
              onChange={handleInputChange}
            />
            <TextField
              label="Qualifications"
              fullWidth
              margin="normal"
              name="qualifications"
              value={formValues.qualifications || ''}
              onChange={handleInputChange}
            />
            <TextField
              label="Available Start Time"
              fullWidth
              margin="normal"
              name="available_start_time"
              value={formValues.available_start_time || 'N/A'}
              onChange={handleInputChange}
            />
            <TextField
              label="Available End Time"
              fullWidth
              margin="normal"
              name="available_end_time"
              value={formValues.available_end_time || 'N/A'}
              onChange={handleInputChange}
            />
            <Button variant="contained" color="primary" sx={{ marginTop: 2 }} onClick={handleFormSubmit}>
              Save Changes
            </Button>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;
