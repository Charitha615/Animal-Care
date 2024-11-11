import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Button,
    TextField,
    CircularProgress,
    Avatar,
    AppBar,
    Toolbar,
    IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import NavBar from "../../NavBar";
import { useNavigate } from 'react-router-dom';

function CustomerProfile() {
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const navigate = useNavigate();

    // Retrieve user ID from localStorage
    const customerId = localStorage.getItem('UserID');

    useEffect(() => {
        if (customerId) {
            // Fetch customer data by ID
            axios.get(`http://localhost/animal_care_api/Customer/getCustomer.php?id=${customerId}`)
                .then(response => {
                    if (response.data.status === 'success') {
                        setCustomer(response.data.data);
                        setFormData(response.data.data);
                    } else {
                        console.error('Customer not found');
                    }
                })
                .catch(error => {
                    console.error('Error fetching the customer data:', error);
                })
                .finally(() => setLoading(false));
        } else {
            console.error('No UserID found in localStorage');
            setLoading(false);
        }
    }, [customerId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSave = () => {



        const data = {
            action: "update",
            id: formData.id,
            customer_name: formData.customer_name,
            address: formData.address,
            phone_no: formData.phone_no,
            email: formData.email
        };

        axios.post(`http://localhost/animal_care_api/Customer/updateCustomer.php`, data)
            .then(response => {
                console.log(response.data);
                if (response.data.status === 'success') {
                    setCustomer(formData);
                    setIsEditing(false);
                } else {
                    console.error('Error updating the customer:', response.data.message);
                }
            })
            .catch(error => {
                console.error('Error during the update request:', error);
            });
    };

    const handleDeactivate = () => {
        console.log(customerId);
        const data = {
            action: "delete",
            id: customerId
        };
        axios.post(`http://localhost/animal_care_api/Customer/deactivateCustomer.php`, data)
            .then(response => {
                if (response.data.status === 'success') {
                    alert('Profile has been deactivated.');
                    localStorage.clear(); // Clear all localStorage data
                    navigate('/'); // Redirect to the home page
                } else {
                    console.error('Error deactivating the profile:', response.data.message);
                }
            })
            .catch(error => {
                console.error('Error during the deactivation request:', error);
            });
    };

    if (loading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="100vh"
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <NavBar />
            <Grid
                container
                justifyContent="center"
                alignItems="center"
                sx={{ minHeight: 'calc(100vh - 64px)', padding: 4 }}
            >
                <Grid item xs={12} sm={10} md={8} lg={6}>
                    <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                        <CardContent>
                            <Box display="flex" justifyContent="center" mb={2}>
                                <Avatar
                                    alt="Customer Profile"
                                    src={'https://cdn.pixabay.com/photo/2019/08/11/18/59/icon-4399701_1280.png'}
                                    sx={{ width: 100, height: 100 }}
                                />
                            </Box>
                            {isEditing ? (
                                <>
                                    <Typography variant="h5" gutterBottom>Edit Customer Profile</Typography>
                                    <TextField
                                        label="Name"
                                        name="customer_name"
                                        value={formData.customer_name}
                                        onChange={handleInputChange}
                                        fullWidth
                                        margin="normal"
                                    />
                                    <TextField
                                        label="Address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        fullWidth
                                        margin="normal"
                                    />
                                    <TextField
                                        label="Phone Number"
                                        name="phone_no"
                                        value={formData.phone_no}
                                        onChange={handleInputChange}
                                        fullWidth
                                        margin="normal"
                                    />
                                    <TextField
                                        label="Email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        fullWidth
                                        margin="normal"
                                    />
                                    <Box display="flex" justifyContent="flex-end" mt={2}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            startIcon={<SaveIcon />}
                                            onClick={handleSave}
                                            sx={{ mr: 1 }}
                                        >
                                            Save
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="secondary"
                                            startIcon={<CancelIcon />}
                                            onClick={() => setIsEditing(false)}
                                        >
                                            Cancel
                                        </Button>
                                    </Box>
                                </>
                            ) : (
                                <>
                                    <Typography variant="h5" gutterBottom>Customer Profile</Typography>
                                    <Typography variant="body1" gutterBottom><strong>Name:</strong> {customer.customer_name}</Typography>
                                    <Typography variant="body1" gutterBottom><strong>Address:</strong> {customer.address}</Typography>
                                    <Typography variant="body1" gutterBottom><strong>Phone:</strong> {customer.phone_no}</Typography>
                                    <Typography variant="body1" gutterBottom><strong>Email:</strong> {customer.email}</Typography>
                                    <Box display="flex" justifyContent="space-between" mt={2}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            startIcon={<EditIcon />}
                                            onClick={() => setIsEditing(true)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="error"
                                            startIcon={<DeleteIcon />}
                                            onClick={handleDeactivate}
                                        >
                                            Deactivate Profile
                                        </Button>
                                    </Box>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}

export default CustomerProfile;
