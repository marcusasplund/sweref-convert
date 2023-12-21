import { Help, Share } from '@suid/icons-material'
import { AppBar, Box, Toolbar, Typography, IconButton } from '@suid/material'

import { JSX } from 'solid-js'

interface TopBarProps {
  handleClickOpen: () => void
}

export default function TopBar (props: TopBarProps): JSX.Element {
  const { handleClickOpen } = props

  const shareApp = async (): Promise<void> => {
    try {
      await window.navigator.share({
        title: 'Sweref convert',
        text: 'Konvertera mellan SWEREF, RT90 och lat, lon',
        url: `https://pap.as${location.pathname}`
      })
    } catch (err) {
      console.log(err)
    }
  }

  const handleShareClick = (): void => {
    shareApp()
      .then(() => {
        console.log('Successful share')
      })
      .catch((error) => {
        console.error('Error sharing', error)
      })
  }

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
            onClick={handleShareClick}
          >
            <Share />
          </IconButton>
          <IconButton
            size='large'
            edge='start'
            color='inherit'
            aria-label='help'
            sx={{ mr: 2 }}
            onClick={handleClickOpen}
          >
            <Help />
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  )
}
