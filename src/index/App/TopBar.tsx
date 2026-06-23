import { AppBar, Box, Toolbar, Typography, IconButton } from '@suid/material'
import { JSX, createSignal, Show, onMount } from 'solid-js'
import { HelpCircle, Share2 } from 'lucide-solid'

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
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position='static' elevation={0}>
        <Toolbar sx={{ minHeight: 64, gap: 1.5, px: { xs: 2, sm: 3 } }}>
          <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
            Sweref convert
          </Typography>
          <Show when={canShare()}>
            <IconButton
              size='large'
              edge='start'
              color='inherit'
              aria-label='share'
              sx={{ mr: 0.5 }}
              onClick={() => { shareApp().catch(err => console.error(err)) }}
            >
              <Share2 />
            </IconButton>
          </Show>
          <IconButton
            size='large'
            edge='start'
            color='inherit'
            aria-label='help'
            sx={{ mr: 0 }}
            onClick={handleClickOpen}
          >
            <HelpCircle />
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  )
}
