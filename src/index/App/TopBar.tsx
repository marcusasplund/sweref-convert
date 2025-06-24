import { Help, Share } from '@suid/icons-material'
import { AppBar, Box, Toolbar, Typography, IconButton } from '@suid/material'
import { JSX, createSignal, Show, onMount } from 'solid-js'

interface TopBarProps {
  handleClickOpen: () => void
}

export default function TopBar (props: TopBarProps): JSX.Element {
  const { handleClickOpen } = props

  // Signal to determine if `navigator.share` is available
  const [canShare, setCanShare] = createSignal(false)

  onMount(() => {
    // Ensure this only runs on the client
    setCanShare(typeof navigator !== 'undefined' && typeof navigator.share === 'function')
  })

  const shareApp = async (): Promise<void> => {
    if (canShare()) {
      try {
        await window.navigator.share({
          title: 'Sweref convert',
          text: 'Konvertera mellan SWEREF, RT90 och lat, lon',
          url: `https://pap.as${location.pathname}`
        })
      } catch (err) {
        console.log(err)
        alert('Sharing failed. Please try again or check your browser support.')
      }
    } else {
      alert('Sharing is not supported in this environment.')
    }
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position='static'>
        <Toolbar>
          <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
            Sweref convert
          </Typography>
          <Show when={canShare()}>
            <IconButton
              size='large'
              edge='start'
              color='inherit'
              aria-label='share'
              sx={{ mr: 2 }}
              onClick={async () => await shareApp()}
            >
              <Share />
            </IconButton>
          </Show>
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
