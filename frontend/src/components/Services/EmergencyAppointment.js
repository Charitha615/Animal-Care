import React, {useState, useEffect} from 'react';
import {
    Divider,
    Paper,
    Box,
    Button,
    Typography,
    Grid,
    Container,
    TextField,
    FormControl,
    RadioGroup,
    FormControlLabel,
    Radio,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Link,
    CircularProgress,
} from '@mui/material';
import NavBar from '../../NavBar'; // Import the NavBar
import axios from 'axios';
import Swal from 'sweetalert2';
import moment from 'moment'; // Import moment.js to handle time
import {gapi} from 'gapi-script'; // Import Google API

const EmergencyAppointment = () => {
    const [time, setTime] = useState(new Date().toLocaleTimeString());
    const [openDialog, setOpenDialog] = useState(false); // Dialog state
    const [paymentConfirmed, setPaymentConfirmed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [doctors, setDoctors] = useState([]); // New state for storing doctors
    const [selectedDoctorId, setSelectedDoctorId] = useState(null); // To store selected doctor ID
    const [doctorSelected, setDoctorSelected] = useState(false); // To track if a doctor is selected
    const [googleMeetingLink, setGoogleMeetingLink] = useState('');

    const [fullName, setFullName] = useState('');
    const [nickName, setNickName] = useState('');
    const [email, setEmail] = useState('');
    const [dob, setDob] = useState('');
    const [gender, setGender] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [cvc, setCvc] = useState('');
    const [expiryDate, setExpiryDate] = useState('');

    const meetingLinks = [
        'https://meet.google.com/abc-defg-hij',
        'https://meet.google.com/klm-nopq-rst',
        'https://meet.google.com/uvw-xyza-abc',
        'https://meet.google.com/uvw-xyza-bcd',
        'https://meet.google.com/uvw-xyza-asd',
        'https://meet.google.com/uvw-xyza-wes',
        'https://meet.google.com/uvw-xyza-hth',
        'https://meet.google.com/uvw-xyza-2es',
        'https://meet.google.com/uvw-xyza-dah',
    ];

    const getRandomMeetingLink = () => {
        const randomIndex = Math.floor(Math.random() * meetingLinks.length);
        return meetingLinks[randomIndex];
    };
    // Handle dialog open and close
    const handleOpenDialog = () => {
        if (selectedDoctorId) {
            setOpenDialog(true);
        } else {
            Swal.fire({
                title: 'No Doctor Selected',
                text: 'Please select a doctor before booking an emergency appointment.',
                icon: 'error',
                confirmButtonText: 'OK',
            });
        }
    };

    // Load the Google API client when the component mounts
    useEffect(() => {
        const initClient = () => {
            gapi.client.init({
                clientId: "177739364117-ar82gij8fo3arkmcvh85484nsfb6qu0m.apps.googleusercontent.com", // Replace with your Google Client ID
                scope: "https://www.googleapis.com/auth/calendar.events",
            });
        };
        gapi.load("client:auth2", initClient);
    }, []);

    // Function to authenticate and create a Google Meet link
    const generateGoogleMeetLink = async () => {
        try {
            const user = await gapi.auth2.getAuthInstance().signIn();
            const calendar = gapi.client.calendar;

            // Define the event details
            const event = {
                summary: "Emergency Appointment",
                start: {
                    dateTime: new Date().toISOString(),
                    timeZone: "America/Los_Angeles",
                },
                end: {
                    dateTime: new Date(Date.now() + 30 * 60000).toISOString(), // 30 minutes later
                    timeZone: "America/Los_Angeles",
                },
                conferenceData: {
                    createRequest: {
                        requestId: "sample-request-id",
                    },
                },
            };

            // Insert the event to create a Google Meet link
            const response = await calendar.events.insert({
                calendarId: "primary",
                resource: event,
                conferenceDataVersion: 1,
            });

            setGoogleMeetingLink(response.result.hangoutLink); // Store the generated link
            return response.result.hangoutLink;
        } catch (error) {
            console.error("Error generating Google Meet link:", error);
            return null;
        }
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setPaymentConfirmed(false); // Reset payment state when dialog closes
    };

    // Get current time
    const getCurrentTime = () => {
        const now = moment(); // Use moment to get the current time
        return now;
    };

    const isDoctorAvailable = (startTime, endTime) => {
        const now = moment();
        let start = moment(startTime, 'HH:mm:ss');
        let end = moment(endTime, 'HH:mm:ss');

        if (end.isBefore(start)) {
            end.add(1, 'day');
        }

        console.log("start time: ", startTime);
        console.log("end time: ", endTime);
        console.log("now time: ", now);

        return now.isBetween(start, end);
    };


    const handlePayment = async () => {
        // Initialize validation error messages
        let errorMessages = [];

        // Regular Expressions for validation
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const dobRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/; // DD/MM/YYYY format
        const cardNumberRegex = /^\d{16}$/; // Basic 16-digit card number validation
        const cvcRegex = /^\d{3,4}$/; // 3 or 4 digit CVC
        const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/; // MM/YY format

        // Validation checks
        if (!fullName) errorMessages.push("Full Name is required.");
        if (!email || !emailRegex.test(email)) errorMessages.push("Invalid Email Address.");
        if (!dob || !dobRegex.test(dob)) errorMessages.push("Invalid Date of Birth format. Use DD/MM/YYYY.");
        if (!gender) errorMessages.push("Gender is required.");
        if (!cardNumber || !cardNumberRegex.test(cardNumber)) errorMessages.push("Card Number must be 16 digits.");
        if (!cvc || !cvcRegex.test(cvc)) errorMessages.push("CVC must be 3 or 4 digits.");
        if (!expiryDate || !expiryRegex.test(expiryDate)) errorMessages.push("Invalid Expiry Date format. Use MM/YY.");

        // If there are any validation errors, show them and stop execution
        if (errorMessages.length > 0) {
            setOpenDialog(false); // Close the dialog first
            Swal.fire({
                title: 'Validation Error',
                html: errorMessages.join('<br>'),
                icon: 'error',
                confirmButtonText: 'OK',
            }).then(() => {
                setOpenDialog(true); // Reopen the dialog after the error alert is acknowledged
            });
            return;
        }

        // Retrieve a random meeting link
        const meetingLink = getRandomMeetingLink();
        setGoogleMeetingLink(meetingLink);

        if (!selectedDoctorId) {
            setOpenDialog(false); // Close the dialog first
            Swal.fire({
                title: 'Error',
                text: 'No doctor selected or available.',
                icon: 'error',
                confirmButtonText: 'OK',
            }).then(() => {
                setOpenDialog(true); // Reopen the dialog after the error alert is acknowledged
            });
            return;
        }

        setLoading(true);

        const userId = localStorage.getItem('UserID');
        const paymentStatus = 'Completed';
        const status = 'NotDone';
        const appointmentTime = moment().format('YYYY-MM-DD HH:mm:ss');

        const payload = {
            action: 'register_emergency_appointment',
            user_id: userId,
            appointment_time: appointmentTime,
            google_meeting_link: meetingLink,
            gender: gender,
            payment_status: paymentStatus,
            doctor_id: selectedDoctorId,
            status: status,
        };

        try {
            setOpenDialog(false);
            setPaymentConfirmed(false);
            const response = await axios.post('http://localhost/animal_care_api/Appointment/EmergencyAppointmentAPI.php', payload);
            if (response.data.status === 'success') {
                setPaymentConfirmed(true);
                Swal.fire({
                    title: 'Payment Successful!',
                    html: `Your emergency appointment has been booked. <br> <a href="${meetingLink}" target="_blank">Join the Meeting</a>`,
                    icon: 'success',
                    confirmButtonText: 'OK',
                });
            } else {
                Swal.fire({
                    title: 'Error',
                    text: response.data.message || 'Failed to book the appointment.',
                    icon: 'error',
                    confirmButtonText: 'Try Again',
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: 'An error occurred while processing your request.',
                icon: 'error',
                confirmButtonText: 'Try Again',
            });
        } finally {
            setLoading(false);
        }
    };


    // Fetch doctors data from API
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await axios.get('http://localhost/animal_care_api/Doctor/GetAllDoctors.php');
                if (response.data.status === 'success') {
                    setDoctors(response.data.doctors); // Set doctors data
                } else {
                    console.error('Failed to fetch doctors');
                }
            } catch (error) {
                console.error('Error fetching doctors:', error);
            }
        };

        fetchDoctors();
    }, []);

    const selectDoctor = (doctorId) => {
        setSelectedDoctorId(doctorId);
        setDoctorSelected(true);
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date().toLocaleTimeString());
        }, 1000);
        return () => clearInterval(timer); // Cleanup on unmount
    }, []);

    return (
        <Box sx={{flexGrow: 1}}>
            <NavBar/>

            <Box sx={{textAlign: 'center', mt: 2}}>
                <Typography variant="h2" component="div" gutterBottom>
                    {time}
                </Typography>
            </Box>

            <Container style={{marginTop: 40}}>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                        <Box
                            sx={{
                                height: 400,
                                backgroundImage:
                                    'url(https://media.istockphoto.com/id/922551734/vector/medical-white-cross.jpg?s=612x612&w=0&k=20&c=d65GPwOOyRVlFEPNSu8_Q7KdF1-CQmT4SZpN6nVUIZI=)',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                        ></Box>
                    </Grid>

                    <Grid item xs={12} md={8}>
                        <Box sx={{textAlign: 'center'}}>
                            <Typography variant="h4" gutterBottom>
                                24-Hour Emergency Services
                            </Typography>
                            <Typography variant="h6" style={{fontWeight: 'bold', marginTop: 50}}>
                                A pet can get sick at any time of the day, but it can be difficult for the pet owner to
                                take the animal to the vet every time. We have introduced these 24-hour emergency
                                services for your convenience in such cases.
                                Here you can meet a veterinarian at any time of the day through video call conference
                                and get the support you need.
                            </Typography>
                            <Typography variant="body1" paragraph style={{marginTop: 50}}>
                                We provide around-the-clock emergency services for your pets with highly trained
                                professionals available at all times.
                            </Typography>

                            {/* Main "Book Emergency Appointment" Button */}
                            <Button
                                variant="contained"
                                color="secondary"
                                size="large"
                                onClick={handleOpenDialog} // Open dialog when clicked
                                sx={{mt: 4}}
                            >
                                Book Emergency Appointment
                            </Button>
                        </Box>
                    </Grid>
                </Grid>

                {/* Our Team Section */}
                <Box sx={{py: 8}}>
                    <Typography variant="h5" align="center" gutterBottom>
                        Our Team
                    </Typography>
                    <Divider sx={{mb: 4, width: '60%', margin: '0 auto'}}/>
                    <Grid container spacing={4} justifyContent="center">
                        {doctors.length > 0 ? (
                            doctors.map((doctor) => {
                                const available = isDoctorAvailable(doctor.available_start_time, doctor.available_end_time);

                                return (
                                    <Grid item xs={12} sm={4} key={doctor.id}>
                                        <Paper
                                            elevation={3}
                                            sx={{
                                                padding: 2,
                                                textAlign: 'center',
                                                border: available ? '3px solid green' : 'none',
                                            }}
                                            onClick={() => selectDoctor(doctor.id)}
                                        >
                                            <Box
                                                sx={{
                                                    height: 150,
                                                    backgroundImage: `url(http://localhost/animal_care_api/Doctor/${doctor.profile_image})`, // Ensure 'doctor.profile_image' is defined
                                                    backgroundSize: 'cover',
                                                    backgroundPosition: 'center',
                                                    mb: 2,
                                                }}
                                            ></Box>

                                            <Typography variant="h6">{doctor.full_name}</Typography>
                                            <Typography
                                                variant="body2">Specialization: {doctor.specialization}</Typography>
                                            <Typography
                                                variant="body2">Experience: {doctor.years_of_experience} years</Typography>
                                            <Typography variant="body2">
                                                Available: {doctor.available_start_time} - {doctor.available_end_time}
                                            </Typography>

                                            {available ? (
                                                <Typography color="primary">Doctor Available</Typography>
                                            ) : (
                                                <Typography color="error">Doctor Unavailable</Typography>
                                            )}
                                        </Paper>
                                    </Grid>
                                );
                            })
                        ) : (
                            <Typography>No doctors available at the moment.</Typography>
                        )}
                    </Grid>
                </Box>
            </Container>

            {/* Dialog for Emergency Appointment */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Emergency Appointment Payment</DialogTitle>
                <DialogContent>
                    {!paymentConfirmed ? (
                        <Box>
                            <form style={{marginTop: 20}}>
                                <Typography variant="h6" gutterBottom>Payment Form</Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Full Name"
                                            fullWidth
                                            variant="outlined"
                                            required
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Nick Name"
                                            fullWidth
                                            variant="outlined"
                                            value={nickName}
                                            onChange={(e) => setNickName(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            label="Email Address"
                                            fullWidth
                                            variant="outlined"
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Date of Birth"
                                            fullWidth
                                            variant="outlined"
                                            placeholder="DD/MM/YYYY"
                                            value={dob}
                                            onChange={(e) => setDob(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <FormControl component="fieldset" fullWidth>
                                            <Typography>Gender</Typography>
                                            <RadioGroup row value={gender} onChange={(e) => setGender(e.target.value)}>
                                                <FormControlLabel value="Male" control={<Radio/>} label="Male"/>
                                                <FormControlLabel value="Female" control={<Radio/>} label="Female"/>
                                            </RadioGroup>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            label="Card Number"
                                            fullWidth
                                            variant="outlined"
                                            type="number"
                                            required
                                            value={cardNumber}
                                            onChange={(e) => setCardNumber(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            label="Card CVC"
                                            fullWidth
                                            variant="outlined"
                                            type="number"
                                            required
                                            value={cvc}
                                            onChange={(e) => setCvc(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Expiry Date (MM/YY)"
                                            fullWidth
                                            variant="outlined"
                                            placeholder="MM/YY"
                                            value={expiryDate}
                                            onChange={(e) => setExpiryDate(e.target.value)}
                                        />
                                    </Grid>
                                </Grid>
                                <Box sx={{textAlign: 'center', marginTop: 4}}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handlePayment}
                                        fullWidth
                                        disabled={loading}
                                    >
                                        {loading ? <CircularProgress size={24}/> : 'PAY NOW'}
                                    </Button>
                                </Box>
                            </form>
                        </Box>
                    ) : (
                        <Box>
                            <Typography>
                                Payment successful! Please join the emergency appointment via the Google Meet link
                                below:
                            </Typography>
                            <Link href={googleMeetingLink} target="_blank" rel="noopener" sx={{mt: 2}}>
                                {googleMeetingLink}
                            </Link>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default EmergencyAppointment;
