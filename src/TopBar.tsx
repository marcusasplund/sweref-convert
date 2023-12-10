import AppBar from '@suid/material/AppBar'
import Box from '@suid/material/Box'
import Toolbar from '@suid/material/Toolbar'
import Typography from '@suid/material/Typography'
import IconButton from '@suid/material/IconButton'
import ShareIcon from '@suid/icons-material/Share'
import Help from '@suid/icons-material/Help'

export const TopBar = (props) => {
    const {handleClickOpen} = props

  const shareApp = () => window.navigator.share({
    title: 'Sweref convert',
    text: 'Info on Nordic repeaters',
    url: `https://pap.as${location.pathname}`
  })
    .then(() => console.log('Successful share'))
    .catch((error) => console.log('Error sharing', error))

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position='static'>
        <Toolbar>
          <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
            Sweref convert
          </Typography>
          <IconButton
            size='large'
            edge='start'
            color='inherit'
            aria-label='share'
            sx={{ mr: 2 }}
            onClick={() => shareApp()}
          >
            <ShareIcon />
          </IconButton>
          <IconButton
            size='large'
            edge='start'
            color='inherit'
            aria-label='help'
            sx={{ mr: 2 }}
            onClick={() => handleClickOpen()}
          >
            <Help />
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  )
}
