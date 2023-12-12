import Papa from 'papaparse'
import { createEffect, createSignal, JSX } from 'solid-js'
import styled from '@suid/material/styles/styled'
import { Box, Button, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@suid/material'
import { SelectChangeEvent } from '@suid/material/Select'
import InfoDialog from './InfoDialog'
import ResultTable from './ResultTable'
import TopBar from './TopBar'
import { LeafletMap } from './LeafletMap'
import { geodeticToGrid } from './geo/geodeticToGrid'
import { gridToGeodetic } from './geo/gridToGeodetic'
import { latToDms, lngToDms } from './geo/latlngConvert'
import { projectionParams } from './constants/projectionParams'
import { selectParams } from './constants/selectParams'
import './App.css'

const FileInput = styled('input')({
  display: 'none'
})

interface CsvData {
  data: string | File
  isFile: boolean
}

interface PapaParseResult {
  data: {
    x: number
    y: number
  }
}

export interface ConvertedRow {
  x: string | number
  y: string | number
  lat: string | number
  lng: string | number
  x2: string | number
  y2: string | number
  latdms: string | number
  lngdms: string | number
}

export default function App (): JSX.Element {
  const [open, setOpen] = createSignal(false)
  const [from, setFrom] = createSignal('rt9025gonV')
  const [to, setTo] = createSignal('wgs84')
  const [rows, setRows] = createSignal<any[]>([])
  const [viewMap, setViewMap] = createSignal(false)
  const [csvData, setCsvData] = createSignal<CsvData | null>(null)
  const [isDisabled, setIsDisabled] = createSignal(true)
  const [twoWay, setTwoWay] = createSignal(false)
  const [conversionChanged, setConversionChanged] = createSignal(false)

  const handleChangeFrom = (event: SelectChangeEvent): void => {
    setFrom(event.target.value)
    setConversionChanged(true)
  }

  const handleChangeTo = (event: SelectChangeEvent): void => {
    setTo(event.target.value)
    setConversionChanged(true)
  }

  const handleClickOpen = (): void => {
    setOpen(true)
  }

  const handleClickClose = (): void => {
    setOpen(false)
  }

  const toggleMap = (): void => {
    setViewMap(!viewMap())
  }

  const downloadCSV = (e: Event): void => {
    if ('preventDefault' in e) e.preventDefault()
    const csvData = Papa.unparse(rows(), {
      delimiter: ';'
    })
    const blob = new Blob([csvData], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'converted.csv'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const convertRow = (x: number | string, y: number | string, currentFrom: string, currentTo: string): ConvertedRow => {
    if (currentFrom !== 'wgs84' && currentTo !== 'wgs84') {
      const converted = gridToGeodetic(x, y, projectionParams(currentFrom))
      const twoWayConverted = geodeticToGrid(converted.lat, converted.lng, projectionParams(currentTo))
      return {
        x,
        y,
        lat: converted.lat,
        lng: converted.lng,
        x2: twoWayConverted.x,
        y2: twoWayConverted.y,
        latdms: latToDms(+converted.lat),
        lngdms: lngToDms(+converted.lat)
      }
    }
    if (currentFrom === 'wgs84') {
      const converted = geodeticToGrid(x, y, projectionParams(currentTo))
      return {
        x: converted.x,
        y: converted.y,
        lat: x,
        lng: y,
        x2: 0,
        y2: 0,
        latdms: latToDms(+x),
        lngdms: lngToDms(+y)
      }
    } else {
      const converted = gridToGeodetic(x, y, projectionParams(currentFrom))
      return {
        x,
        y,
        lat: converted.lat,
        lng: converted.lng,
        x2: 0,
        y2: 0,
        latdms: latToDms(+converted.lat),
        lngdms: lngToDms(+converted.lat)
      }
    }
  }

  const processCsvData = (data: CsvData): void => {
    Papa.parse(data.data, {
      download: data.isFile,
      header: true,
      step: (results: PapaParseResult) => {
        const convertedRow = convertRow(results.data.x, results.data.y, from(), to())
        setRows((prevRows) => [...prevRows, convertedRow])
      },
      complete: () => setViewMap(false)
    })
  }

  createEffect(() => {
    const data = csvData()
    if (data != null) {
      setRows([])
      processCsvData(data)
    }
  })

  createEffect(() => {
    if (conversionChanged()) {
      const currentFrom = from()
      const currentTo = to()
      const convertedData = rows().map(row => convertRow(row.x, row.y, currentFrom, currentTo))
      setRows(convertedData)
      setConversionChanged(false)
    }
  })

  createEffect(() => {
    const hasMultipleRows = rows().length > 1
    setIsDisabled(!hasMultipleRows)
  })

  createEffect(() => {
    const istwoWay = from() !== 'wgs84' && to() !== 'wgs84'
    setTwoWay(istwoWay)
  })
  const parseFile = (e: Event): void => {
    const target = e.target as HTMLInputElement
    if ((target.files != null) && target.files.length > 0) {
      setCsvData({ data: target.files[0], isFile: false })
    }
  }

  const parseString = (e: Event): void => {
    const target = e.target as HTMLInputElement
    setCsvData({ data: target.value, isFile: false })
  }

  const parseRemote = (e: Event): void => {
    const target = e.target as HTMLInputElement
    setCsvData({ data: target.value, isFile: true })
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
            selectParams.map((p: any) => (
              <MenuItem key={p.value} value={p.value}>{p.text}</MenuItem>)
            )
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
            selectParams.map((p: any) => (
              <MenuItem key={p.value} value={p.value}>{p.text}</MenuItem>
            ))
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
            <label for='contained-button-file'>
              <FileInput
                accept='.csv'
                id='contained-button-file'
                multiple
                type='file'
                onChange={parseFile}
              />
              <Button variant='contained' component='span' fullWidth>
                Ladda upp .csv
              </Button>
            </label>
            <Button onClick={downloadCSV} disabled={isDisabled()} variant='contained'>
              Ladda ned konverterad .csv
            </Button>
            <Button onClick={toggleMap} disabled={isDisabled()} variant='outlined'>
              {viewMap() ? 'Tabellvy' : 'Kartvy'}
            </Button>
          </Stack>
        </Box>
        <Box
          sx={{
            paddingTop: 2
          }}
        >
          <Stack
            spacing={2} direction='column' sx={{
              paddingBottom: 2
            }}
          >
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
          {viewMap() && rows().length > 0 && <LeafletMap rows={rows} />}
          {!viewMap() && rows().length > 0 && <ResultTable twoWay={twoWay} rows={rows} />}
        </Box>
      </div>
      <InfoDialog open={open} onClose={handleClickClose} />
    </div>
  )
}
