import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  IconButton,
  InputBase,
  Select,
  MenuItem
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useParams } from 'react-router-dom';
import CreateSiteModal from './CreateSiteModal';
import { useNavigate } from 'react-router-dom';

const Sites = () => {
  const { studyId } = useParams();
  const [modalOpen, setModalOpen] = useState(false);
  const [sites, setSites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSites = async () => {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/api/sites/${studyId}`);
      const data = await response.json();
      setSites(data);
    };

    if (studyId) fetchSites();
  }, [studyId, modalOpen]); // ✅ Add dependency here


  const handleSiteCreated = () => {
    setModalOpen(false);
  };

  return (
    <Box p={3}>
      {/* Header Row */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Sites</Typography>
        <Box display="flex" gap={1}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ textTransform: 'none' }}
            onClick={() => setModalOpen(true)}
          >
            New Site
          </Button>
          <Button variant="outlined" startIcon={<FilterListIcon />} sx={{ textTransform: 'none' }}>
            Filters
          </Button>
        </Box>
      </Box>

      {/* Modal */}
      <CreateSiteModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={handleSiteCreated}
        studyId={studyId}
      />

      {/* Site List */}
      {Array.isArray(sites) && sites.map((site) => (
        <Paper
          key={site._id}
          sx={{
            mb: 2,
            px: 2,
            py: 1.5,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
          onClick={() => navigate(`/subjects/${site._id}`)}
        >
          <Box>
            <Typography fontWeight="bold">{site.siteName}</Typography>
            <Typography variant="body2" color="text.secondary">
              {site.location || 'No location'} • {site.contactEmail || 'No email'}
            </Typography>
          </Box>
        </Paper>
      ))}
    </Box>
  );
};

export default Sites;
