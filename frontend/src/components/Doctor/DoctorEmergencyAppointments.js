// EmergencyAppointments.js
import React, { useState } from 'react';
import { Box, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button } from '@mui/material';

const EmergencyAppointments = () => {
  const [emergencies, setEmergencies] = useState([
    { patient: 'Alice Johnson', date: '2024-10-05', time: '12:00 PM', urgency: 'High' }
  ]);

  return (
    <Box sx={{ py: 8, px: 4 }}>
      <Typography variant="h4" gutterBottom>Emergency Appointments</Typography>
      <Paper elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Patient</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Urgency</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {emergencies.map((emergency, index) => (
              <TableRow key={index}>
                <TableCell>{emergency.patient}</TableCell>
                <TableCell>{emergency.date}</TableCell>
                <TableCell>{emergency.time}</TableCell>
                <TableCell>{emergency.urgency}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      <Button variant="contained" sx={{ mt: 2 }} color="error">
        Mark as Handled
      </Button>
    </Box>
  );
};

export default EmergencyAppointments;
