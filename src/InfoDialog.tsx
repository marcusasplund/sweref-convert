import Button from '@suid/material/Button'
import Dialog from '@suid/material/Dialog'
import DialogActions from '@suid/material/DialogActions'
import DialogContent from '@suid/material/DialogContent'
import DialogContentText from '@suid/material/DialogContentText'
import DialogTitle from '@suid/material/DialogTitle'

export const InfoDialog = (props) => {
  const { onClose, open } = props

  const handleClose = () => {
    onClose()
  }

  return (
    <Dialog onClose={handleClose} open={open()}>
      <DialogTitle>Help</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Denna app är till för att snabbt konvertera stora mängder koordinater mellan RT90/SWEREF och WGS84.
          Det enklaste är att ladda upp ett .csv-dokument med två kolumner; en x- o en y-kolumn. Om ni vill konvertera från WGS84 så bocka i rutan för detta. Välj sedan önskad projektion i select-menyn. Om din ursprungsdata är i ngt SWEREF- eller RT90-format så lämna WGS84-rutan omarkerad och välj den projektion som din ursprungsdata är i. Kolumnerna lat, lng i resultatet kommer då att vara konverterade till WGS84. Klicka gärna på knappen "visa karta" för att kontrollera så att konverteringen ser ut att ha gått rätt till. Om den ser heltokig ut så kan du försöka att byta plats på kolumnerna x o y i din ursprungsdata innan du laddar upp.
        </DialogContentText>
        <DialogContentText>
          Du kan även klistra in data direkt i textfältet, alternativt klistra in en länk i det mindre fältet om du har ett dokument på nån server nånstans.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color='primary'>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

