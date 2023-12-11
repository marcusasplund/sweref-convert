import Button from '@suid/material/Button'
import Papa from 'papaparse'
import { Stack, Typography, Box, TextField, FormControl, InputLabel, MenuItem, Select } from '@suid/material'
import TopBar from './TopBar'
import { createSignal, createEffect } from 'solid-js'
import styled from '@suid/material/styles/styled'
import { SelectChangeEvent } from '@suid/material/Select'
import {gridToGeodetic} from './geo/gridToGeodetic'
import {geodeticToGrid} from './geo/geodeticToGrid'
import {latToDms, lngToDms} from './geo/latlngConvert'
import { InfoDialog } from './InfoDialog'
import {selectParams} from './constants/selectParams'
import {projectionParams} from './constants/projectionParams'
import ResultTable from './ResultTable'
import './App.css'

const FileInput = styled('input')({
  display: 'none'
})

export default function App () {
  const [open, setOpen] = createSignal(false)
  const [from, setFrom] = createSignal('rt9025gonV')
  const [to, setTo] = createSignal('wgs84')
  const [rows, setRows] = createSignal<Array<any>>([])
  const [viewMap, setViewMap] = createSignal(false)
  const [csvData, setCsvData] = createSignal<any>(null);

  const handleChangeFrom = (event: SelectChangeEvent) => {
    setFrom(event.target.value)
  }

  const handleChangeTo = (event: SelectChangeEvent) => {
    setTo(event.target.value)
  }

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClickClose = () => {
    setOpen(false)
  }

  const downloadCSV = (e) => {
    e.preventDefault ? e.preventDefault() : (e.returnValue = false);
  
    // Convert your data to CSV format
    const csvData = Papa.unparse(rows(), {
      delimiter: ';'
    });
  
    // Create a Blob from the CSV data
    const blob = new Blob([csvData], { type: 'text/csv' });
  
    // Create a link and set the URL
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'converted.csv';
  
    // Append the link to the document and trigger a click
    document.body.appendChild(link);
    link.click();
  
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const addRows = (results) => {
    const data = results.data
    const keys = Object.keys(data)
    // first column
    const x = data[keys[0]]
    // second column
    const y = data[keys[1]]
    // TODO: faulty data handling
    if (from() !== 'wgs84' && to() !== 'wgs84'){
      const converted = gridToGeodetic(x, y, projectionParams(to()))
      const twoWayConverted = geodeticToGrid(converted.lat, converted.lng, projectionParams(to()))
      setRows((prevRows) => [
        ...prevRows,
          {
            x: twoWayConverted.x,
            y: twoWayConverted.y,
            lat: converted.x,
            lng: converted.y,
            latdms: latToDms(+converted.x),
            lngdms: lngToDms(+converted.y)
          }
        ]);
    }
    if (from() === 'wgs84') {
      const converted = geodeticToGrid(x, y, projectionParams(to()))
      setRows((prevRows) => [
        ...prevRows,
          {
            x: converted.x,
            y: converted.y,
            lat: x,
            lng: y,
            latdms: latToDms(+x),
            lngdms: lngToDms(+y)
          }
        ]);

    } else {
      const converted = gridToGeodetic(x, y, projectionParams(from()))
      setRows((prevRows) => [
        ...prevRows,
          {
            x: x,
            y: y,
            lat: converted.lat,
            lng: converted.lng,
            latdms: latToDms(+converted.lat),
            lngdms: lngToDms(+converted.lat)
          }
        ]);
    }
  }

  createEffect(() => {
    const data: any = csvData();
    if (data) {
      setRows([])
      Papa.parse(data, {
        download: data.isFile,
        header: true,
        step: (results) => addRows(results),
        complete: () => setViewMap(false),
      });
    } else {
      setRows([])
    }
  });

  const parseFile = (e) => setCsvData(e.target.files[0]);
  const parseString = (e) => setCsvData(e.target.value);
  const parseRemote = (e) => setCsvData({ data: e.target.value, isFile: true });

  const toggleMap = () => {
    setViewMap(!viewMap())
  }

  return (
    <div class='App'>
      <TopBar handleClickOpen={handleClickOpen} />
      <div class='container'>
        <Typography
          variant='h4' component='div' sx={{
            paddingBottom: 5
          }}
        >
          Konvertera mellan SWEREF99, RT90, WGS84
        </Typography>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={{ xs: 1, sm: 2 }}
        >
          <FormControl fullWidth>
            <InputLabel id='demo-simple-select-label'>Konvertera från</InputLabel>
            <Select
              value={from()}
              label='Konvertera från'
              onChange={handleChangeFrom}
            >
              {
            selectParams.map(p => <MenuItem value={p.value}>{p.text}</MenuItem>)
          }
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id='demo-simple-select-label'>Konvertera till</InputLabel>
            <Select
              value={to()}
              label='Konvertera till'
              onChange={handleChangeTo}
            >
              {
            selectParams.map(p => <MenuItem value={p.value}>{p.text}</MenuItem>)
          }

            </Select>
          </FormControl>
        </Stack>
        <Box
          sx={{
            paddingTop: 2
          }}
        >
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={{ xs: 1, sm: 2 }}
          >
            <label for="contained-button-file">
        <FileInput
          accept=".csv"
          id="contained-button-file"
          multiple
          type="file"
          onChange={parseFile}
        />
        <Button variant="contained" component="span">
        Ladda upp .csv
        </Button>
      </label>
            <Button onClick={downloadCSV} disabled variant='contained'>
              Ladda ned konverterad .csv
            </Button>
            <Button onClick={toggleMap} disabled variant='outlined'>
              {viewMap() ? 'Tabellvy' : 'Kartvy'}
            </Button>
          </Stack>
        </Box>
        <Box
          sx={{
            paddingTop: 2
          }}
        >
          <Stack spacing={2} direction='column'>
            <TextField
              id='outlined-basic'
              label='Klistra in url till fil från server'
              variant='outlined'
              onInput={e => parseRemote(e)}
            />
            <TextField
              id='outlined-basic'
              label='Klistra in tabell med två kolumner med X o Y, N o E eller lat o lng'
              variant='outlined'
              multiline
              rows={6}
              onInput={e => parseString(e)}
              fullWidth
            />
          </Stack>
          {rows().length > 0 && <ResultTable rows={rows} /> }
        </Box>
      </div>
      <InfoDialog open={open} onClose={handleClickClose} />
    </div>
  )
}
