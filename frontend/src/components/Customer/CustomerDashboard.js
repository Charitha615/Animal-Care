import React from 'react';
import { Container, Grid, Paper, Typography, Box } from '@mui/material';

const CustomerDashboard = () => {
  return (
    <Container maxWidth="lg" style={{ marginTop: '50px' }}>
      <Grid container spacing={3}>
        {/* Welcome Banner */}
        <Grid item xs={12}>
          <Paper elevation={3} style={{ padding: '20px' }}>
            <Typography variant="h4" gutterBottom>Welcome to the Customer Dashboard</Typography>
            <Typography variant="subtitle1">View and manage your account details.</Typography>
          </Paper>
        </Grid>

        {/* Account Overview */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: '20px' }}>
            <Typography variant="h6" gutterBottom>Account Overview</Typography>
            <Box>Details about the customer's account.</Box>
          </Paper>
        </Grid>

        {/* Orders Widget */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: '20px' }}>
            <Typography variant="h6" gutterBottom>Recent Orders</Typography>
            <Box>List of recent orders and their statuses.</Box>
          </Paper>
        </Grid>

        {/* Support Widget */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: '20px' }}>
            <Typography variant="h6" gutterBottom>Support Tickets</Typography>
            <Box>View and submit support tickets.</Box>
          </Paper>
        </Grid>

        {/* Notifications */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: '20px' }}>
            <Typography variant="h6" gutterBottom>Notifications</Typography>
            <Box>View account and order notifications.</Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CustomerDashboard;
