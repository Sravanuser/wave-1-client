import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box
} from '@mui/material';

const CreateSiteModal = ({ open, onClose, onCreate, studyId }) => {
    const [formData, setFormData] = useState({
        siteName: '',
        location: '',
        contactEmail: '',
        studyId: ''
    });

    // Update formData.studyId whenever the prop changes
    useEffect(() => {
        if (studyId) {
            setFormData(prev => ({ ...prev, studyId }));
        }
    }, [studyId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL;
            const response = await fetch(`${apiUrl}/sites`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (response.ok) {
                alert('Site created successfully!');
                setFormData({ siteName: '', location: '', contactEmail: '', studyId });
                onClose();
                onCreate?.(data); // optional callback
            } else {
                alert(data.message || 'Failed to create site.');
            }
        } catch (err) {
            alert('Server error.');
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Create New Site</DialogTitle>
            <DialogContent>
                <Box display="flex" flexDirection="column" gap={2} mt={1}>
                    <TextField
                        label="Site Name"
                        name="siteName"
                        value={formData.siteName}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        label="Location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                    />
                    <TextField
                        label="Contact Email"
                        name="contactEmail"
                        value={formData.contactEmail}
                        onChange={handleChange}
                        type="email"
                    />
                </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={onClose}>Cancel</Button>
                <Button variant="contained" onClick={handleSubmit}>Create</Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateSiteModal;
