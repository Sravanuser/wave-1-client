import {
  Box,
  Typography,
  Paper,
  Button,
  IconButton,
  InputBase,
  Select,
  MenuItem
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import FilterListIcon from '@mui/icons-material/FilterList'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import ScienceIcon from '@mui/icons-material/Science'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { useNavigate } from 'react-router-dom'
import React, { useEffect, useState } from 'react'

const Studies = () => {
  const navigate = useNavigate()
  const [studies, setStudies] = useState([])

  useEffect(() => {
    const fetchStudies = async () => {
      const apiUrl = import.meta.env.VITE_API_URL;
      const token = JSON.parse(localStorage.getItem("userData"))?.token; // or data.token based on your API response
      try {
        const response = await fetch(`${apiUrl}/studies/getstudy`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Pass token
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch studies: ${response.status}`);
        }

        const data = await response.json();
        setStudies(data);
      } catch (error) {
        console.error("Failed to fetch studies:", error);
      }
    };

    fetchStudies();
  }, []);


  return (
    <Box p={3}>
      {/* Header Row */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">My studies</Typography>
        <Box display="flex" gap={1}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ textTransform: 'none' }}
            onClick={() => navigate('/studies/create')}
          >
            New Study
          </Button>
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            sx={{ textTransform: 'none' }}
          >
            Filters
          </Button>
        </Box>
      </Box>

      {/* Search and Sort */}
      <Box display="flex" alignItems="center" gap={2} mb={2} flexWrap="wrap">
        <Paper
          component="form"
          sx={{
            p: '2px 8px',
            display: 'flex',
            alignItems: 'center',
            width: 250,
            height: 36,
            border: '1px solid #ccc',
            borderRadius: 1,
          }}
        >
          <SearchIcon sx={{ color: 'gray' }} />
          <InputBase
            placeholder="Search"
            sx={{ ml: 1, flex: 1, fontSize: '0.9rem' }}
          />
        </Paper>
        <Typography variant="body2" sx={{ color: '#666' }}>
          Order by
        </Typography>
        <Select
          size="small"
          defaultValue="newest"
          sx={{ height: 36, minWidth: 230 }}
        >
          <MenuItem value="newest">Creation date: Newest first</MenuItem>
          <MenuItem value="oldest">Creation date: Oldest first</MenuItem>
        </Select>
      </Box>

      {/* Info Banner */}
      <Paper
        variant="outlined"
        sx={{
          backgroundColor: '#F9FAFB',
          display: 'flex',
          alignItems: 'center',
          px: 2,
          py: 1.5,
          mb: 2,
          borderRadius: 1,
          borderColor: '#ccc',
          maxWidth: 1200,
          justifyContent: 'space-between',
        }}
      >
        <Box display="flex" alignItems="center">
          <InfoOutlinedIcon sx={{ color: '#F59E0B', mr: 1 }} />
          <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
            View an <strong>Example Study</strong> to help familiarise yourself with Castor.
          </Typography>
        </Box>
        <IconButton size="small">✕</IconButton>
      </Paper>

      {/* Study List */}
      {studies.map((study) => (
        <Box
          key={study._id}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            px: 1,
            py: 2,
            borderBottom: '1px solid #eee',
            maxWidth: 1200,
          }}
          onClick={() => navigate(`/sites/${study._id}`)}
        >
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="body2" sx={{ color: '#666' }}>
              ○ Not Live
            </Typography>
            <ScienceIcon fontSize="small" />
            <Typography variant="subtitle1" fontWeight="bold">
              Test Study:
            </Typography>
            <Typography variant="body1">
              {study.studyName || 'pace'}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="body2" sx={{ color: '#666' }}>
              {study.center || 'Monocenter'}
            </Typography>
            <Typography variant="body2" sx={{ color: '#8b8b8b' }}>
              {study.server || 'EU Server'}
            </Typography>
            <IconButton size="small">
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      ))}
    </Box>
  )
}

export default Studies
