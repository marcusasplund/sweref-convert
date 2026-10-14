import { useTransContext } from '@jellybrick/solid-i18next'
import LanguageSwitcher from './LanguageSwitcher'
import { AppBar, Box, Toolbar, Typography, IconButton } from '@suid/material'
import { JSX, createSignal, Show, onMount } from 'solid-js'
import { HelpCircle, Share2, Sun, Moon } from 'lucide-solid'
import { useColorMode } from '../../theme'

interface TopBarProps {
  handleClickOpen: () => void
}

export default function TopBar (props: TopBarProps): JSX.Element {
  const [t] = useTransContext()
  const { handleClickOpen } = props
  const { mode, toggle } = useColorMode()

  // Signal to determine if `navigator.share` is available
  const [canShare, setCanShare] = createSignal(false)

  onMount(() => {
    // Ensure this only runs on the client
    setCanShare(typeof navigator !== 'undefined' && typeof navigator.share === 'function')
  })

  const shareApp = async (): Promise<void> => {
    try {
      await window.navigator.share({
        text: t('description'),
        title: 'Sweref convert',
        url: `https://pap.as${location.pathname}`
      })
    } catch (err) {
      console.log(err)
      alert(t('shareError'))
    }
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position='static' elevation={0} sx={{ bgcolor: mode() === 'dark' ? 'background.paper' : 'primary.main', color: '#fff' }}>
        <Toolbar sx={{ gap: { sm: 1.5, xs: 0.5 }, minHeight: 64, px: { sm: 3, xs: 2 } }}>
          <Typography variant='h6' component='div' sx={{ flexGrow: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            Sweref convert
          </Typography>
          <LanguageSwitcher />
          <IconButton
            size='large'
            color='inherit'
            aria-label={mode() === 'dark' ? t('lightMode') : t('darkMode')}
            title={mode() === 'dark' ? t('lightMode') : t('darkMode')}
            onClick={toggle}
          >
            <Show when={mode() === 'dark'} fallback={<Sun aria-hidden='true' />}>
              <Moon aria-hidden='true' />
            </Show>
          </IconButton>
          <Show when={canShare()}>
            <IconButton
              size='large'
              edge='start'
              color='inherit'
              aria-label={t('share')}
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
            aria-label={t('help')}
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
