import React, { useEffect, useState } from 'react';
import './AdminDashboard.css';
import AdminNavBar from './AdminNavBar';
import Modal from './Modal';
import { Dialog, DialogContent, DialogTitle, Typography } from '@mui/material';
import { jsPDF } from 'jspdf';
import "jspdf-autotable";

const AdminDashboard = () => {
    const [appointments, setAppointments] = useState([]);
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [inquiries, setInquiries] = useState([]);
    const [feedback, setFeedbacks] = useState([]);
    const [filterType, setFilterType] = useState('all');
    const [date, setDate] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [showModal, setShowModal] = useState(false);
    const [selectedLink, setSelectedLink] = useState('');
    const [showInquiriesModal, setShowInquiriesModal] = useState(false);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);

    useEffect(() => {
        // Fetching appointments
        fetch("http://localhost/animal_care_api/Appointment/get_all_emergency_appointments.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === "success") {
                    setAppointments(data.data);
                    setFilteredAppointments(data.data); // Initialize with all appointments
                }
            })
            .catch(error => console.error("Error fetching appointments:", error));

        // Fetching inquiries
        fetch("http://localhost/animal_care_api/Inquiry/get_all_inquiries.php")
            .then(response => response.json())
            .then(data => {
                if (data.status === "success") {
                    setInquiries(data.data);
                }
            })
            .catch(error => console.error("Error fetching inquiries:", error));

        // Fetching feedback
        fetch("http://localhost/animal_care_api/Feedback/get_all_feedback.php")
            .then(response => response.json())
            .then(data => {
                if (data.status === "success") {
                    setFeedbacks(data.data);
                }
            })
            .catch(error => console.error("Error fetching inquiries:", error));
    }, []);

    const handleFilterChange = (e) => {
        const filter = e.target.value;
        setFilterType(filter);
        filterAppointments(filter, date);
    };

    const handleDateChange = (e) => {
        const selectedDate = e.target.value;
        setDate(selectedDate);
        filterAppointments(filterType, selectedDate);
    };

    const filterAppointments = (filter, date) => {
        let filtered;
        const dateObj = new Date(date);

        if (filter === 'daily') {
            filtered = appointments.filter(appointment => {
                const appointmentDate = new Date(appointment.appointment_time);
                return appointmentDate.toDateString() === dateObj.toDateString();
            });
        } else if (filter === 'monthly') {
            filtered = appointments.filter(appointment => {
                const appointmentDate = new Date(appointment.appointment_time);
                return (
                    appointmentDate.getMonth() === dateObj.getMonth() &&
                    appointmentDate.getFullYear() === dateObj.getFullYear()
                );
            });
        } else if (filter === 'yearly') {
            filtered = appointments.filter(appointment => {
                const appointmentDate = new Date(appointment.appointment_time);
                return appointmentDate.getFullYear() === dateObj.getFullYear();
            });
        } else {
            filtered = appointments;
        }

        setFilteredAppointments(filtered);
    };

    const generatePDF = () => {
        const doc = new jsPDF();

        // Set up the title with larger font
        doc.setFontSize(18);
        doc.text("Emergency Appointments Report", 105, 20, { align: "center" });

        // Add a subtitle with smaller font
        doc.setFontSize(12);
        doc.text("List of emergency appointments with details", 105, 30, { align: "center" });

        // Line break after the title
        doc.setLineWidth(0.5);
        doc.line(10, 35, 200, 35);

        // Define the headers and rows for the table
        const tableHeaders = ["ID", "Customer", "Time", "Status"];
        const tableRows = filteredAppointments.map(appointment => [
            appointment.id,
            appointment.customer_name,
            appointment.appointment_time,
            appointment.status
        ]);

        // Use jsPDF AutoTable plugin to create a styled table
        doc.autoTable({
            startY: 40, // Position the table after the title
            head: [tableHeaders],
            body: tableRows,
            theme: "grid",
            styles: { fontSize: 10, cellPadding: 3 },
            headStyles: { fillColor: [0, 123, 255], textColor: [255, 255, 255] },
            alternateRowStyles: { fillColor: [240, 240, 240] }
        });

        // Save the PDF
        doc.save("Emergency_Appointments_Report.pdf");
    };

    const handleLinkClick = (link) => {
        setSelectedLink(link);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedLink('');
    };

    const openInquiriesModal = () => {
        setShowInquiriesModal(true);
    };

    const closeInquiriesModal = () => {
        setShowInquiriesModal(false);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredAppointments.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    const openFeedbacksModal = () => setShowFeedbackModal(true);
    const closeFeedbacksModal = () => setShowFeedbackModal(false);

    return (
        <div className="admin-dashboard">
            <AdminNavBar />

            <main className="main-content">
                <header className="header">
                    <button
                        className="logout-btn"
                        onClick={() => {
                            localStorage.clear();
                            window.location.href = "/";
                        }}
                    >
                        Logout
                    </button>
                    <button className="profile-btn">Profile</button>
                </header>

                <section className="dashboard-content">
                    <div className="dashboard-cards">
                        <div className="card" onClick={openInquiriesModal}>
                            <h3>{inquiries.length} Messages</h3>
                            <p>Inquiry</p>
                        </div>
                        <div className="card" onClick={openFeedbacksModal}>
                            <h3>{feedback.length} Notifications</h3>
                            <p>Feedback</p>
                        </div>
                    </div>

                    <div className="appointments">
                        <h3>Emergency Appointments</h3>

                        <div className="filter-section">
                            <select value={filterType} onChange={handleFilterChange}>
                                <option value="all">All</option>
                                <option value="daily">Daily</option>
                                <option value="monthly">Monthly</option>
                                <option value="yearly">Yearly</option>
                            </select>
                            <input type="date" value={date} onChange={handleDateChange}/>
                            <button onClick={generatePDF}>Download PDF</button>
                        </div>


                        <table>
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Customer Name</th>
                                <th>Appointment Time</th>
                                <th>Gender</th>
                                <th>Status</th>
                                <th>Doctor ID</th>
                                <th>Google Meet Link</th>
                            </tr>
                            </thead>
                            <tbody>
                            {currentItems.map((appointment, index) => (
                                <tr key={index}>
                                    <td>{appointment.id}</td>
                                    <td>{appointment.customer_name}</td>
                                    <td>{appointment.appointment_time}</td>
                                    <td>{appointment.gender}</td>
                                    <td>{appointment.status}</td>
                                    <td>{appointment.doctor_id}</td>
                                    <td>
                                        <button onClick={() => handleLinkClick(appointment.google_meeting_link)}>
                                            Show Link
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>

                        <div className="pagination">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>
                            {Array.from({ length: totalPages }, (_, index) => (
                                <button
                                    key={index}
                                    className={currentPage === index + 1 ? "active" : ""}
                                    onClick={() => handlePageChange(index + 1)}
                                >
                                    {index + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </section>

                <Modal show={showModal} onClose={closeModal}>
                    <h3>Google Meet Link</h3>
                    <p><a href={selectedLink} target="_blank" rel="noopener noreferrer">{selectedLink}</a></p>
                </Modal>

                <Dialog open={showInquiriesModal} onClose={closeInquiriesModal} maxWidth="md" fullWidth>
                    <DialogTitle>All Inquiries</DialogTitle>
                    <DialogContent dividers>
                        <ul>
                            {inquiries.map((inquiry) => (
                                <React.Fragment key={inquiry.id}>
                                    <li>
                                        <Typography><strong>Name:</strong> {inquiry.name}</Typography>
                                        <Typography><strong>Email:</strong> {inquiry.email}</Typography>
                                        <Typography><strong>Subject:</strong> {inquiry.subject}</Typography>
                                        <Typography><strong>Message:</strong> {inquiry.message}</Typography>
                                        <Typography><strong>Date:</strong> {inquiry.created_at}</Typography>
                                        <hr />
                                    </li>
                                </React.Fragment>
                            ))}
                        </ul>
                    </DialogContent>
                </Dialog>

                <Dialog open={showFeedbackModal} onClose={closeFeedbacksModal} maxWidth="md" fullWidth>
                    <DialogTitle>All Feedbacks</DialogTitle>
                    <DialogContent dividers>
                        <ul>
                            {feedback.map((feedback) => (
                                <React.Fragment key={feedback.id}>
                                    <li>
                                        <Typography><strong>Name:</strong> {feedback.id}</Typography>
                                        <Typography><strong>User Id:</strong> {feedback.user_id}</Typography>
                                        <Typography><strong>Feedback Type:</strong> {feedback.feedback_type}</Typography>
                                        <Typography><strong>Comment:</strong> {feedback.comments}</Typography>
                                        <Typography><strong>Date:</strong> {feedback.created_at}</Typography>
                                        <hr />
                                    </li>
                                </React.Fragment>
                            ))}
                        </ul>
                    </DialogContent>
                </Dialog>
            </main>
        </div>
    );
};

export default AdminDashboard;
