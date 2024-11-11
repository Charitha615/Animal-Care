import React, {useState} from 'react';
import {Container, Typography, Box, TextField, Button, Paper, Avatar, IconButton} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import axios from 'axios';
import NavBar from "../../NavBar";

const PetRegistration = () => {
    const [formValues, setFormValues] = useState({
        petName: '',
        breed: '',
        age: ''
    });
    const [vaccinationDetails, setVaccinationDetails] = useState([{vaccinationName: '', vaccinationDate: ''}]);
    const [profileImage, setProfileImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormValues({...formValues, [name]: value});
    };

    const handleVaccinationChange = (index, e) => {
        const {name, value} = e.target;
        const updatedDetails = [...vaccinationDetails];
        updatedDetails[index][name] = value;
        setVaccinationDetails(updatedDetails);
    };

    const handleAddVaccination = () => {
        setVaccinationDetails([...vaccinationDetails, {vaccinationName: '', vaccinationDate: ''}]);
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setProfileImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async () => {
        // Validation for required fields
        if (!formValues.petName || !formValues.breed || !formValues.age) {
            alert('Please fill out all required fields: Pet Name, Breed, and Age.');
            return; // Stop the function if any required field is empty
        }

        const formData = new FormData();
        formData.append('petName', formValues.petName);
        formData.append('breed', formValues.breed);
        formData.append('age', formValues.age);
        formData.append('user_id', localStorage.getItem('UserID'));
        if (profileImage) {
            formData.append('petImage', profileImage);
        }
        formData.append('vaccinationDetails', JSON.stringify(vaccinationDetails));

        try {
            const response = await axios.post('http://localhost/animal_care_api/Pet/pet_registration.php', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert(response.data.message);

            // Reload the page after 10 seconds
            setTimeout(() => {
                window.location.reload();
            }, 1000);

        } catch (error) {
            alert(`Error: ${error.response ? error.response.data.message : 'Failed to submit pet registration'}`);
        }
    };

    return (
        <Box sx={{flexGrow: 1}}>
            <NavBar/>
            <Container style={{marginTop:30}}>
                {/* Pet Details Form */}
                <Typography variant="h4" align="center" gutterBottom>
                    Pet Registration
                </Typography>

                <Paper elevation={3} sx={{padding: 3, marginBottom: 4}}>
                    <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                        {/* Image Upload Section */}
                        <Avatar
                            src={imagePreview}
                            alt="Pet Profile"
                            sx={{width: 150, height: 150, marginBottom: 2}}
                        />
                        <Button variant="outlined" component="label">
                            Upload Pet Image
                            <input type="file" hidden accept="image/*" onChange={handleImageChange}/>
                        </Button>

                        {/* Pet Details Inputs */}
                        <TextField
                            label="Pet Name"
                            name="petName"
                            value={formValues.petName}
                            onChange={handleInputChange}
                            fullWidth
                        />
                        <TextField
                            label="Breed"
                            name="breed"
                            value={formValues.breed}
                            onChange={handleInputChange}
                            fullWidth
                        />
                        <TextField
                            label="Age"
                            name="age"
                            value={formValues.age}
                            onChange={handleInputChange}
                            type="number"
                            fullWidth
                        />
                    </Box>
                </Paper>

                {/* Vaccination Details Form */}
                <Typography variant="h6" gutterBottom>
                    Add Vaccination Details
                </Typography>
                {vaccinationDetails.map((detail, index) => (
                    <Paper key={index} elevation={3} sx={{padding: 3, marginBottom: 2}}>
                        <Box display="flex" flexDirection="column" gap={2}>
                            <TextField
                                label="Vaccination Name"
                                name="vaccinationName"
                                value={detail.vaccinationName}
                                onChange={(e) => handleVaccinationChange(index, e)}
                                fullWidth
                            />
                            <TextField
                                label="Vaccination Date"
                                type="date"
                                name="vaccinationDate"
                                value={detail.vaccinationDate}
                                onChange={(e) => handleVaccinationChange(index, e)}
                                fullWidth
                                InputLabelProps={{shrink: true}}
                            />
                        </Box>
                    </Paper>
                ))}

                <Box display="flex" justifyContent="center" marginBottom={2}>
                    <IconButton color="primary" onClick={handleAddVaccination}>
                        <AddCircleIcon/>
                    </IconButton>
                    <Typography>Add another vaccination</Typography>
                </Box>

                {/* Submit Button */}
                <Box display="flex" justifyContent="center" marginTop={3}>
                    <Button variant="contained" color="primary" onClick={handleSubmit}>
                        Submit Registration
                    </Button>
                </Box>
            </Container>
        </Box>
    );
};

export default PetRegistration;
