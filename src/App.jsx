import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Box } from '@mui/material'
import Studies from './pages/study/Studies'
import CreateStudies from './pages/study/CreateStudies'
import Header from './components/Header'
import SitesPage from './pages/site/Sites'
import Subjects from './pages/subject/Subjects'
import { Navigate } from 'react-router-dom'
import Forms from './pages/visit/FormDetails'

function App() {
  return (
    <Router>
      <Box sx={{ display: 'flex' }}>
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Header />
           <Routes>
            <Route path="/" element={<Navigate to="/studies" replace />} />
            <Route path="/studies" element={<Studies />} />
            <Route path="/studies/create" element={<CreateStudies />} />
            <Route path="/sites/:studyId" element={<SitesPage />} />
            <Route path="/subjects/:sitesId" element={<Subjects />} />
            <Route path="/forms/:subjectId" element={<Forms />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  )
}

export default App
