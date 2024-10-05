import React from 'react';
import { Container, Grid, Paper } from '@mui/material';

const StaffDashboard = () => {
  return (
    <Container maxWidth="lg">
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: '20px' }}>
            <h2>Welcome to Staff Dashboard</h2>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default StaffDashboard;
