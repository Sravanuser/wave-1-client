import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL;

// API Functions
const getSubjectsBySite = async (siteId) => {
  const res = await fetch(`${API_URL}/subjects/${siteId}`);
  if (!res.ok) throw new Error("Failed to fetch subjects");
  return res.json();
};

const createSubject = async (data) => {
  const res = await fetch(`${API_URL}/subjects`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const responseData = await res.json();
  if (!res.ok) throw new Error(responseData.message || "Create subject failed");

  return responseData.subject;
};

// Modal Component
const CreateSubjectModal = ({ open, onClose, siteId, onSuccess }) => {
  const [form, setForm] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async () => {
    try {
      setLoading(true);
      const subject = await createSubject({ ...form, site: siteId });
      onSuccess(subject);
      onClose();
      setForm({ name: '', email: '' });

      toast.success('Subject created successfully!'); // ✅ Toast on success
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
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
            value={form.name}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            fullWidth
            required
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Cancel</Button>
        <Button variant="contained" onClick={handleCreate} disabled={loading}>
          {loading ? 'Creating...' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Main Page
const Subjects = () => {
  const { sitesId } = useParams();
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchSubjects = async () => {
    try {
      const data = await getSubjectsBySite(sitesId);
      setSubjects(data);
    } catch (err) {
      console.error("Failed to load subjects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, [sitesId]);

  const handleSubjectCreated = (newSubject) => {
    setSubjects((prev) => [...prev, newSubject]);
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Subjects</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setModalOpen(true)}>
          New Subject
        </Button>
      </Box>

      <CreateSubjectModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        siteId={sitesId}
        onSuccess={handleSubjectCreated}
      />

      {loading ? (
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress />
        </Box>
      ) : subjects.length === 0 ? (
        <Typography>No subjects found.</Typography>
      ) : (
        subjects.map((subject) => (
          <Paper
            key={subject._id}
            sx={{
              mb: 2,
              p: 2,
              cursor: 'pointer',
              '&:hover': { backgroundColor: '#f5f5f5' }
            }}
            onClick={() => navigate(`/forms/${subject._id}`)}
          >
            <Typography fontWeight="bold">{subject.name}</Typography>
            <Typography variant="body2">Email: {subject.email}</Typography>
          </Paper>
        ))
      )}
    </Box>
  );
};

export default Subjects;
