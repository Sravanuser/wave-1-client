import React, { useState } from 'react';
import {
    Box, List, ListItemButton, ListItemText, Accordion, AccordionSummary, AccordionDetails,
    Typography, FormControlLabel, RadioGroup, Radio, Paper, Divider, Button
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { useParams } from 'react-router-dom';

export default function Forms() {
    const { subjectId } = useParams();
    const formSections = [
        {
            label: 'Screening',
            subsections: [
                '1. Date of Visit',
                '2. Eligibility Criteria',
                '3. Demographics'
            ]
        },
        {
            label: 'Medical',
            subsections: [
                '4. Medical and Surgical History',
                '5. Pregnancy Test'
            ]
        }
    ];

    const formSchema = {
        '1. Date of Visit': [
            { type: 'radio', label: 'Was the Visit Performed?', options: ['Yes', 'Other'], name: 'visitPerformed' }
        ],
        '2. Eligibility Criteria': [
            { type: 'radio', label: 'Age ≥18 and ≤85 years at screening', options: ['Yes', 'No'], name: 'ageValid' },
            { type: 'radio', label: 'Diagnosis of non-valvular AF', options: ['Yes', 'No'], name: 'diagnosis' }
        ],
        '3. Demographics': [
            { type: 'radio', label: 'Gender', options: ['Male', 'Female'], name: 'gender' },
            { type: 'radio', label: 'Ethnic Group', options: ['Asian', 'Black', 'White', 'Other'], name: 'ethnicity' }
        ],
        '4. Medical and Surgical History': [
            { type: 'radio', label: 'Any prior surgery?', options: ['Yes', 'No'], name: 'priorSurgery' }
        ],
        '5. Pregnancy Test': [
            { type: 'radio', label: 'Pregnancy Test Done?', options: ['Yes', 'No'], name: 'pregnancyTest' }
        ]
    };

    const [selectedForm, setSelectedForm] = useState(null);
    const [formValues, setFormValues] = useState({});
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        setFormValues(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            setSuccessMessage('');
            setErrorMessage('');
            const apiUrl = import.meta.env.VITE_API_URL;
            const response = await fetch(`${apiUrl}/api/screenings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formValues, subjectId }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage('Form submitted successfully!');
                setFormValues({});
            } else {
                setErrorMessage(data.message || 'Failed to submit the form');
            }
        } catch (error) {
            setErrorMessage('Error submitting the form: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box display="flex" height="100vh" bgcolor="#f5f5f5">
            {/* Sidebar */}
            <Box
                width={300}
                p={2}
                borderRight="1px solid #ddd"
                overflow="auto"
                sx={{ backgroundColor: '#f4f6f8' }}
            >
                <Typography variant="h6" mb={2}>Data collection progress</Typography>
                <Divider sx={{ mb: 2 }} />
                {formSections.map(section => (
                    <Accordion key={section.label} disableGutters defaultExpanded>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography variant="subtitle1" fontWeight={600}>{section.label}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <List dense>
                                {section.subsections.map(sub => (
                                    <ListItemButton
                                        key={sub}
                                        onClick={() => setSelectedForm(sub)}
                                        selected={selectedForm === sub}
                                        sx={{
                                            borderRadius: 1,
                                            mb: 0.5,
                                            '&.Mui-selected': {
                                                backgroundColor: '#1976d2',
                                                color: 'white',
                                                '&:hover': { backgroundColor: '#1565c0' }
                                            }
                                        }}
                                    >
                                        {/* Optional: Icon showing progress */}
                                        {
                                            formSchema[sub]?.every(f => formValues[f.name]) ?
                                                <CheckCircleIcon fontSize="small" color="success" sx={{ mr: 1 }} /> :
                                                <RadioButtonUncheckedIcon fontSize="small" color="disabled" sx={{ mr: 1 }} />
                                        }
                                        <ListItemText primary={sub} />
                                    </ListItemButton>
                                ))}
                            </List>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </Box>

            {/* Main Form Area */}
            <Box flex={1} p={4} overflow="auto">
                {selectedForm ? (
                    <>
                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                            {selectedForm}
                        </Typography>
                        {formSchema[selectedForm]?.map((field, idx) => (
                            <Paper
                                key={idx}
                                elevation={1}
                                sx={{
                                    mb: 3,
                                    p: 2,
                                    backgroundColor: '#ffffff',
                                    borderLeft: '4px solid #1976d2'
                                }}
                            >
                                <Typography variant="subtitle1" gutterBottom fontWeight={500}>
                                    {`${idx + 1}. ${field.label}`} {field.required && <span style={{ color: 'red' }}>*</span>}
                                </Typography>
                                <RadioGroup
                                    row
                                    name={field.name}
                                    value={formValues[field.name] || ''}
                                    onChange={handleChange}
                                >
                                    {field.options.map(opt => (
                                        <FormControlLabel
                                            key={opt}
                                            value={opt}
                                            control={<Radio />}
                                            label={opt}
                                            sx={{ mr: 3 }}
                                        />
                                    ))}
                                </RadioGroup>
                            </Paper>
                        ))}
                    </>
                ) : (
                    <Typography variant="h6" color="text.secondary">Select a form from the left</Typography>
                )}

                {/* Success/Error Messages */}
                {successMessage && <Typography variant="body1" color="green">{successMessage}</Typography>}
                {errorMessage && <Typography variant="body1" color="red">{errorMessage}</Typography>}
            </Box>

            {/* Fixed Submit Button */}
            <Box
                sx={{
                    position: 'fixed',
                    bottom: 20,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    padding: 2,
                    backgroundColor: 'white',
                    zIndex: 10,
                    boxShadow: 3
                }}
            >
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    disabled={loading}
                    sx={{
                        minWidth: 200,
                        px: 4,
                        py: 1.5,
                        fontWeight: 'bold',
                        borderRadius: 1
                    }}
                >
                    {loading ? 'Submitting...' : 'Submit'}
                </Button>
            </Box>

        </Box>
    );
}
