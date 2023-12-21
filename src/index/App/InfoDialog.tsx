import { JSX } from 'solid-js'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@suid/material'

interface InfoDialogProps {
  onClose: () => void
  open: () => boolean
}

export default function InfoDialog (props: InfoDialogProps): JSX.Element {
  const { onClose, open } = props

  const handleClose = (): void => {
    onClose()
  }

  return (
    <Dialog onClose={handleClose} open={open()}>
      <DialogTitle>Hjälp</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <p>
            Denna app är till för att snabbt konvertera stora mängder koordinater mellan RT90, SWEREF och WGS84.
            Det enklaste är att ladda upp ett .csv-dokument med två kolumner; en x- o en y-kolumn. Klicka gärna på knappen "visa karta" för att kontrollera så att konverteringen ser ut att ha gått rätt till.
            Om den ser heltokig ut så kan du försöka att byta plats på kolumnerna x o y i din ursprungsdata innan du laddar upp.
          </p>
          <p>Du kan även klistra in data direkt i textfältet, alternativt klistra in en länk i det mindre fältet om du har ett dokument på nån server nånstans. </p>
          <p>
            <b>Exempeldata, så här bör den se ut:</b><br />
            x,y<br />
            6373105,1316400<br />
            6371176,1312784<br />
            6371447,1318751<br />
          </p>
          <p>
            <b>Exempelfil:</b><br />
            <a download='rt90.csv' target='_blank' rel='noopener noreferrer' href='https://pap.as/sweref/rt90.csv'>https://pap.as/sweref/rt90.csv</a>
          </p>
          <p>
            Jag tar tacksamt emot synpunkter o önskemål på funktioner till appen.
          </p>
          <p>
            Maila mig gärna på <a href='mailto:&#114;&#111;&#111;&#116;&#102;&#111;&#111;&#100;&#64;&#103;&#109;&#97;&#105;&#108;&#46;&#99;&#111;&#109;'>&#114;&#111;&#111;&#116;&#102;&#111;&#111;&#100;&#64;&#103;&#109;&#97;&#105;&#108;&#46;&#99;&#111;&#109;</a>
          </p>
          <p>
            Beräkningsalgoritmerna kommer från <a href='http://latlong.mellifica.se'>latlong.mellifica.se</a>{' '}
            där finns lite mer info. Källkoden till denna app hittar ni{' '}
            <a href='https://github.com/marcusasplund/sweref-convert'>här</a>
          </p>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color='primary'>
          Stäng
        </Button>
      </DialogActions>
    </Dialog>
  )
}
