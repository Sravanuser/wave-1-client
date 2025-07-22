import React from 'react'
import { Drawer, List, ListItem, ListItemText } from '@mui/material'
import { Link } from 'react-router-dom'

const drawerWidth = 240

const Sidebar = () => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      <List>
        <ListItem button component={Link} to="/participants">
          <ListItemText primary="Participants" />
        </ListItem>
        <ListItem button component={Link} to="/repeating-data">
          <ListItemText primary="Repeating Data" />
        </ListItem>
        <ListItem button component={Link} to="/surveys">
          <ListItemText primary="Surveys" />
        </ListItem>
      </List>
    </Drawer>
  )
}

export default Sidebar
