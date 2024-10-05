// ProfileManagement.js
import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';

const ProfileManagement = () => {
  const [profile, setProfile] = useState({
    name: 'Dr. John Doe',
    email: 'dr.john@hospital.com',
    specialization: 'Cardiologist'
  });

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    // handle profile save logic
    console.log('Profile Updated', profile);
  };

  return (
    <Box sx={{ py: 8, px: 4 }}>
      <Typography variant="h4" gutterBottom>Profile Management</Typography>
      <TextField
        label="Name"
        name="name"
        fullWidth
        margin="normal"
        value={profile.name}
        onChange={handleChange}
      />
      <TextField
        label="Email"
        name="email"
        fullWidth
        margin="normal"
        value={profile.email}
        onChange={handleChange}
      />
      <TextField
        label="Specialization"
        name="specialization"
        fullWidth
        margin="normal"
        value={profile.specialization}
        onChange={handleChange}
      />
      <Button variant="contained" sx={{ mt: 2 }} onClick={handleSubmit}>
        Save Changes
      </Button>
    </Box>
  );
};

export default ProfileManagement;
