import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField
} from '@mui/material';
import NavBar from "../../NavBar";
import axios from 'axios';

const ViewMyPets = () => {
    const [petsData, setPetsData] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedPetId, setSelectedPetId] = useState(null);
    const [newVaccination, setNewVaccination] = useState({ vaccination_name: '', vaccination_date: '' });
    const userID = localStorage.getItem('UserID'); // Retrieve UserID from localStorage

    useEffect(() => {
        const fetchPetData = async () => {
            try {
                if (!userID) {
                    alert('UserID not found. Please log in.');
                    return;
                }

                // Fetch pet details from the API
                const response = await axios.get(`http://localhost/animal_care_api/Pet/view_my_pets.php?UserID=${userID}`);
                const petsData = response.data.data;

                console.log(petsData);

                setPetsData(petsData || []);
            } catch (error) {
                alert(`Error: ${error.response ? error.response.data.message : 'Failed to fetch pet details'}`);
            }
        };

        fetchPetData();
    }, [userID]);

    const handleDialogOpen = (petId) => {
        setSelectedPetId(petId);
        setOpenDialog(true);
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewVaccination({ ...newVaccination, [name]: value });
    };

    const handleAddVaccination = async () => {
        if (!selectedPetId) return;

        try {
            const response = await axios.post(
                'http://localhost/animal_care_api/Vaccination/add_vaccination.php',
                {
                    pet_id: selectedPetId,
                    vaccination_name: newVaccination.vaccination_name,
                    vaccination_date: newVaccination.vaccination_date,
                    status: 'upcoming'
                },
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );

            alert('Vaccination added successfully!');
            const updatedPetsData = petsData.map(pet => {
                if (pet.id === selectedPetId) {
                    return {
                        ...pet,
                        vaccinations: [...pet.vaccinations, {
                            vaccination_name: newVaccination.vaccination_name,
                            vaccination_date: newVaccination.vaccination_date,
                            status: 'upcoming'
                        }]
                    };
                }
                return pet;
            });
            setPetsData(updatedPetsData);
            setNewVaccination({ vaccination_name: '', vaccination_date: '' });
            handleDialogClose();
        } catch (error) {
            alert(`Error: ${error.response ? error.response.data.message : 'Failed to add vaccination'}`);
        }
    };

    const handleMarkAsComplete = async (petId, vaccinationId) => {
        try {
            const response = await axios.post('http://localhost/animal_care_api/Vaccination/update_vaccination_status.php', {
                vaccination_id: vaccinationId,
                status: 'completed'
            });

            alert('Vaccination marked as completed!');
            const updatedPetsData = petsData.map(pet => {
                if (pet.id === petId) {
                    const updatedVaccinations = pet.vaccinations.map(v =>
                        v.id === vaccinationId ? { ...v, status: 'completed' } : v
                    );
                    return {
                        ...pet,
                        vaccinations: updatedVaccinations
                    };
                }
                return pet;
            });
            setPetsData(updatedPetsData);
        } catch (error) {
            alert(`Error: ${error.response ? error.response.data.message : 'Failed to update vaccination status'}`);
        }
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <NavBar />
            <Container>
                {petsData.length > 0 ? (
                    petsData.map((pet, petIndex) => (
                        <Box key={petIndex} mb={6}>
                            <Box display="flex" flexDirection="column" alignItems="center" marginBottom={2}>
                                <Box
                                    component="img"
                                    src={`http://localhost/animal_care_api/Pet/${pet.image_path}`}
                                    alt={pet.pet_name}
                                    sx={{ width: 150, height: 150, borderRadius: '50%', marginBottom: 2 }}
                                />
                                <Typography variant="h6">Pet Details</Typography>
                                <Typography variant="body1">
                                    Name: {pet.pet_name}, Breed: {pet.breed}, Age: {pet.age} years
                                </Typography>
                            </Box>

                            {/* Completed Vaccinations */}
                            <Typography variant="h6" gutterBottom>Details of Vaccination Given So Far</Typography>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Vaccination Name</TableCell>
                                            <TableCell>Given Date</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {pet.vaccinations.filter(v => v.status === 'completed').length > 0 ? (
                                            pet.vaccinations.filter(v => v.status === 'completed').map((vaccination, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{vaccination.vaccination_name}</TableCell>
                                                    <TableCell>{vaccination.vaccination_date}</TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={2} align="center">
                                                    No vaccination records available.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            {/* Upcoming Vaccinations */}
                            <Typography variant="h6" gutterBottom sx={{ marginTop: 4 }}>
                                Details of Vaccinations to be Given in Future
                            </Typography>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Vaccination Name</TableCell>
                                            <TableCell>Next Vaccination Date</TableCell>
                                            <TableCell>Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {pet.vaccinations.filter(v => v.status === 'upcoming').length > 0 ? (
                                            pet.vaccinations.filter(v => v.status === 'upcoming').map((vaccination, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{vaccination.vaccination_name}</TableCell>
                                                    <TableCell>{vaccination.vaccination_date}</TableCell>
                                                    <TableCell>
                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                            onClick={() => handleMarkAsComplete(pet.id, vaccination.id)}
                                                        >
                                                            Mark as Complete
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={3} align="center">
                                                    No upcoming vaccination records.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            {/* Add Vaccination Button */}
                            <Box display="flex" justifyContent="center" marginTop={2}>
                                <Button variant="contained" color="primary" onClick={() => handleDialogOpen(pet.id)}>
                                    Add More Details
                                </Button>
                            </Box>
                        </Box>
                    ))
                ) : (
                    <Typography align="center" variant="h6" gutterBottom>
                        Loading pet details...
                    </Typography>
                )}

                {/* Dialog for Adding Details */}
                <Dialog open={openDialog} onClose={handleDialogClose}>
                    <DialogTitle>Add Vaccination Details</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Enter the name and date for the upcoming vaccination.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Vaccination Name"
                            type="text"
                            fullWidth
                            name="vaccination_name"
                            value={newVaccination.vaccination_name}
                            onChange={handleInputChange}
                        />
                        <TextField
                            margin="dense"
                            label="Vaccination Date"
                            type="date"
                            fullWidth
                            name="vaccination_date"
                            value={newVaccination.vaccination_date}
                            onChange={handleInputChange}
                            InputLabelProps={{ shrink: true }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDialogClose} color="secondary">
                            Cancel
                        </Button>
                        <Button onClick={handleAddVaccination} color="primary">
                            Add
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
};

export default ViewMyPets;
