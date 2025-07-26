import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Divider,
  FormLabel,
  FormControl,
  Link,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const CreateStudy = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    studyName: '',
    trialRegistryID: '',
    siteName: '',
    abbreviation: '',
    country: 'Netherlands',
    template: '',
    studyType: '',
  });
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleSubmit = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;

      // Get token from localStorage
      const token = JSON.parse(localStorage.getItem("userData"))?.token;

      const response = await fetch(`${apiUrl}/studies`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Pass token here
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Study created successfully!");
        navigate("/studies");
      } else {
        alert(data.message || "Error creating study.");
      }
    } catch (err) {
      alert("Getting Server error from here.");
    }
  };

  return (
    <Box p={4} maxWidth={800} mx="auto">
      <Box display="flex" alignItems="center" mb={2}>
        <ArrowBackIcon sx={{ mr: 1 }} />
        <Typography variant="h6">Create new study</Typography>
      </Box>

      <Box mb={4}>
        <Typography fontWeight="bold">Study information</Typography>
        <Typography variant="body2" color="text.secondary">
          Your study will be created on the Netherlands Server in the European Region because you are logged in the domain: <strong>data</strong>.castoredc.com.
          Read more about our server clusters <Link href="#">here</Link>.
        </Typography>
      </Box>

      <Box display="flex" flexDirection="column" gap={3}>
        <TextField
          label="Name of your study"
          name="studyName"
          required
          helperText="Minimum 3 characters."
          onChange={handleChange}
        />

        <TextField
          label="Trial registry ID"
          name="trialRegistryID"
          helperText="If your study is linked to a trial registered in a trial database, please supply the trial registry ID."
          onChange={handleChange}
        />

        <Divider />

        <Typography fontWeight="bold">Initiating site information</Typography>

        <TextField
          label="Name of your site"
          name="siteName"
          required
          helperText="A default 'Test Site' will be created automatically. Please choose a different name for any additional site you want to create. Minimum 3 characters."
          onChange={handleChange}
        />

        <TextField
          label="Abbreviation"
          name="abbreviation"
          required
          helperText="This will be used in participant IDs. 3–6 characters."
          onChange={handleChange}
        />

        <Divider />

        <FormControl component="fieldset">
          <FormLabel component="legend" required>Templates</FormLabel>
          <RadioGroup name="template" onChange={handleChange}>
            <FormControlLabel value="Randomized trial" control={<Radio />} label="Randomized trial" />
            <FormControlLabel value="Observational study" control={<Radio />} label="Observational study" />
            <FormControlLabel value="Registry / Biobank" control={<Radio />} label="Registry / Biobank" />
            <FormControlLabel value="Survey study" control={<Radio />} label="Survey study" />
            <FormControlLabel value="All forms" control={<Radio />} label="All forms" />
            <FormControlLabel value="No template" control={<Radio />} label="No template" />
          </RadioGroup>
        </FormControl>

        <FormControl component="fieldset">
          <FormLabel component="legend" required>Study type</FormLabel>
          <RadioGroup name="studyType" onChange={handleChange}>
            <FormControlLabel value="Production" control={<Radio />} label="Production" />
            <FormControlLabel value="Test" control={<Radio />} label="Test" />
            <FormControlLabel value="Example" control={<Radio />} label="Example" />
          </RadioGroup>
        </FormControl>

        <Box display="flex" gap={2}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Create Study
          </Button>
          <Button variant="outlined" onClick={() => window.history.back()}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CreateStudy;
