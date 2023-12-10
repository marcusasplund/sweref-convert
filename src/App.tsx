import Button from "@suid/material/Button";
import Dialog from "@suid/material/Dialog";
import DialogActions from "@suid/material/DialogActions";
import DialogContent from "@suid/material/DialogContent";
import DialogContentText from "@suid/material/DialogContentText";
import DialogTitle from "@suid/material/DialogTitle";
import { Stack, Typography } from "@suid/material";
import { Box, TextField } from "@suid/material";
import {TopBar} from "./TopBar";
import { createSignal } from "solid-js";
import PhotoCamera from "@suid/icons-material/PhotoCamera";
import { IconButton } from "@suid/material";
import styled from "@suid/material/styles/styled";
import "./App.css"

const Input = styled("input")({
  display: "none",
});

const HelpDialog = (props) => {
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

export default function App() {
    const [open, setOpen] = createSignal(false)

    const handleClickOpen = () => {
        setOpen(true)
    }

    const handleClickClose = () => {
        setOpen(false)
    }

  return (
    <div class='App'>
        <TopBar handleClickOpen={handleClickOpen} />
        <div class="container">
          <Typography>
          Konvertera mellan SWEREF99, RT90, WGS84
          </Typography>
        <Stack spacing={2} direction="row">
        <label for="contained-button-file">
        <Input
          accept="image/*"
          id="contained-button-file"
          multiple
          type="file"
        />
        <Button variant="contained" component="span">
          Upload
        </Button>
      </label>
      <label for="icon-button-file">
        <Input accept="image/*" id="icon-button-file" type="file" />
        <IconButton
          color="primary"
          aria-label="upload picture"
          component="span"
        >
          <PhotoCamera />
        </IconButton>
      </label>
      <Button variant="contained">Contained</Button>
      <Button variant="outlined">Outlined</Button>
    </Stack>
        <Box
      component="form"
      sx={{
        "& > :not(style)": { m: 1, width: "25ch" },
        textAlign: "center",
      }}
      noValidate
      autocomplete="off"
    >
      <TextField
        id="outlined-basic"
        label="Outlined"
        variant="outlined"
        fullWidth
      />
    </Box>
    </div>
        <HelpDialog open={open} onClose={handleClickClose}/>
    </div>
  );
}