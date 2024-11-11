import React, {useState} from 'react';
import {FaRegSmile, FaRegFrown} from 'react-icons/fa';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Feedback.css';
import NavBar from "../../NavBar";
import {Box} from "@mui/material";

const Feedback = () => {
    const [feedbackType, setFeedbackType] = useState('');
    const [comments, setComments] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Get user ID from localStorage
        const userId = localStorage.getItem('UserID');

        // Validate the inputs
        if (!feedbackType || !comments) {
            toast.error('Please fill in all fields.');
            return;
        }

        if (!userId) {
            toast.error('User not found. Please log in.');
            return;
        }

        try {
            // Make a POST request to the API
            const response = await fetch('http://localhost/animal_care_api/Feedback/store_feedback.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: userId,
                    feedback_type: feedbackType,
                    comments: comments,
                }),
            });

            const data = await response.json();

            // Check if the response was successful
            if (response.ok) {
                toast.success(data.message || 'Feedback submitted successfully!');
                // Clear the form
                setFeedbackType('');
                setComments('');
            } else {
                toast.error(data.message || 'Failed to submit feedback.');
            }
        } catch (error) {
            console.error('Error submitting feedback:', error);
            toast.error('An error occurred. Please try again later.');
        }
    };

    return (
        <Box sx={{flexGrow: 1}}>
            <NavBar/> {/* Use the NavBar component */}
            <div className="feedback-container">
                <h2>Feedback</h2>
                <form onSubmit={handleSubmit}>
                    <div className="feedback-type">
                        <button
                            type="button"
                            onClick={() => setFeedbackType('positive')}
                            className={feedbackType === 'positive' ? 'selected' : ''}
                        >
                            <FaRegSmile size={30}/>
                            Positive
                        </button>
                        <button
                            type="button"
                            onClick={() => setFeedbackType('negative')}
                            className={feedbackType === 'negative' ? 'selected' : ''}
                        >
                            <FaRegFrown size={30}/>
                            Negative
                        </button>
                    </div>

                    <textarea
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        placeholder="Your feedback"
                    />

                    <button type="submit">Submit</button>
                </form>
                <ToastContainer/>
            </div>
        </Box>
    );
};

export default Feedback;
