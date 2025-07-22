import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  IconButton,
  InputBase,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

// Modal Component
const CreateSubjectModal = ({ open, onClose, onCreate, siteId }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    site: siteId
  });

  useEffect(() => {
    setFormData(prev => ({ ...prev, site: siteId }));
  }, [siteId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/api/subjects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (response.ok) {
        alert('Subject created successfully!');
        onCreate(data.subject);
        setFormData({ name: '', email: '', site: siteId });
        onClose();
      } else {
        alert(data.message || 'Failed to create subject.');
      }
    } catch (error) {
      console.error('Server error:', error);
      alert('Server error.');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Create New Subject</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
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

// Subjects Page
const Subjects = () => {
  const { sitesId } = useParams();
  const [subjects, setSubjects] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const fetchSubjects = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/subjects/${sitesId}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setSubjects(data);
      } else {
        console.warn('Subjects fetch did not return an array:', data);
        setSubjects([]);
      }
    } catch (err) {
      console.error('Failed to fetch subjects:', err);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, [sitesId]);

  const handleSubjectCreated = (newSubject) => {
    setSubjects(prev => Array.isArray(prev) ? [...prev, newSubject] : [newSubject]);
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Subjects</Typography>
        <Box display="flex" gap={1}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setModalOpen(true)}
          >
            New Subject
          </Button>
          <Button variant="outlined" startIcon={<FilterListIcon />}>
            Filters
          </Button>
        </Box>
      </Box>

      <CreateSubjectModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={handleSubjectCreated}
        siteId={sitesId}
      />

      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <Paper
          component="form"
          sx={{ p: '2px 8px', display: 'flex', alignItems: 'center', width: 250 }}
        >
          <SearchIcon sx={{ color: 'gray' }} />
          <InputBase placeholder="Search" sx={{ ml: 1, flex: 1 }} />
        </Paper>
      </Box>

      {subjects.length > 0 ? (
        subjects.map((subject) => (
          <Paper
            key={subject._id}
            sx={{
              mb: 2,
              px: 2,
              py: 1.5,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
            onClick={() => navigate(`/forms/${subject._id}`)}
          >
            <Box>
              <Typography fontWeight="bold">{subject.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                ID: {subject.id} • Email: {subject.email}
              </Typography>
            </Box>
          </Paper>
        ))
      ) : (
        <Typography>No subjects found.</Typography>
      )}
    </Box>
  );
};

export default Subjects;
