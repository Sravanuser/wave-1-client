import { AppBar, Toolbar, Typography } from '@mui/material'

const Header = () => (
  <AppBar position="static" color="default" elevation={0}>
    <Toolbar>
      <Typography variant="h6">Participants</Typography>
    </Toolbar>
  </AppBar>
)

export default Header
