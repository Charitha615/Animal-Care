// Appointments.js
import React, { useState } from 'react';
import { Box, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button } from '@mui/material';

const Appointments = () => {
  const [appointments, setAppointments] = useState([
    { patient: 'John Smith', date: '2024-10-07', time: '10:00 AM' },
    { patient: 'Jane Doe', date: '2024-10-08', time: '11:00 AM' }
  ]);

  return (
    <Box sx={{ py: 8, px: 4 }}>
      <Typography variant="h4" gutterBottom>Upcoming Appointments</Typography>
      <Paper elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Patient</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.map((appointment, index) => (
              <TableRow key={index}>
                <TableCell>{appointment.patient}</TableCell>
                <TableCell>{appointment.date}</TableCell>
                <TableCell>{appointment.time}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default Appointments;
