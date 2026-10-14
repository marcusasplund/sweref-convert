import { useTransContext } from '@jellybrick/solid-i18next'
import { JSXElement } from 'solid-js'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography
} from '@suid/material'

interface InfoDialogProps {
  onClose: () => void
  open: () => boolean
}

export default function InfoDialog (props: InfoDialogProps): JSXElement {
  const [t] = useTransContext()
  const { onClose, open } = props

  const handleClose = (): void => {
    onClose()
  }

  return (
    <Dialog onClose={handleClose} open={open()}>
      <DialogTitle>{t('help')}</DialogTitle>
      <DialogContent>
        <DialogContentText component='div' sx={{ '& a': { color: 'primary.main' }, '& li': { mb: 1 }, '& pre': { overflowX: 'auto' } }}>
          <p>{t('helpIntro')}</p>
          <ol>
            <li>{t('helpChoose')}</li>
            <li>{t('helpUpload')} {t('helpPaste')}</li>
            <li>{t('helpVerify')}</li>
            <li>{t('helpExport')}</li>
          </ol>
          <p>{t('helpSwap')}</p>
          <Typography component='h3' variant='subtitle1' sx={{ fontWeight: 600 }}>
            {t('exampleData')}
          </Typography>
          <pre><code>{'x,y\n6373105,1316400\n6371176,1312784\n6371447,1318751'}</code></pre>
          <p>
            <a download='rt90.csv' target='_blank' rel='noopener noreferrer' href='https://pap.as/sweref/rt90.csv'>{t('exampleFile')}</a>
          </p>
          <Typography component='h3' variant='subtitle1' sx={{ fontWeight: 600 }}>
            {t('contact')}
          </Typography>
          <p>
            {t('feedback')}
          </p>
          <p>
            {t('email')} <a href='mailto:&#114;&#111;&#111;&#116;&#102;&#111;&#111;&#100;&#64;&#103;&#109;&#97;&#105;&#108;&#46;&#99;&#111;&#109;'>&#114;&#111;&#111;&#116;&#102;&#111;&#111;&#100;&#64;&#103;&#109;&#97;&#105;&#108;&#46;&#99;&#111;&#109;</a>
          </p>
          <p>
            {t('algorithms')} <a href='https://latlong.mellifica.se'>latlong.mellifica.se</a>{' '}
          </p>
          <p>
            <a href='https://github.com/marcusasplund/sweref-convert'>{t('sourceCode')}</a>
          </p>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color='primary'>
          {t('close')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
