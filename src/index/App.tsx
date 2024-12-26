import { createEffect, createSignal, JSX } from 'solid-js'

import styled from '@suid/material/styles/styled'
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography
} from '@suid/material'

import InfoDialog from './App/InfoDialog'
import ResultTable from './App/ResultTable'
import TopBar from './App/TopBar'
import { LeafletMap } from './App/LeafletMap'
import { selectParams } from './App/selectParams'

import Papa from 'papaparse'
import { CsvData, PapaParseResult } from './types'

import './App/App.css'
import { convertRow } from './App/conversionLogic'
import {ProjectionKey} from "./App/projectionParams";

const FileInput = styled('input')({
  display: 'none'
})

export default function App (): JSX.Element {
  const [open, setOpen] = createSignal(false)
  const [from, setFrom] = createSignal<ProjectionKey>('rt9025gonV')
  const [to, setTo] = createSignal<ProjectionKey>('wgs84')
  const [rows, setRows] = createSignal<any[]>([])
  const [viewMap, setViewMap] = createSignal(false)
  const [csvData, setCsvData] = createSignal<CsvData | null>(null)
  const [isDisabled, setIsDisabled] = createSignal(true)
  const [twoWay, setTwoWay] = createSignal(false)
  const [conversionChanged, setConversionChanged] = createSignal(false)

  const handleChangeFrom = (value: ProjectionKey): void => {
    setFrom(value)
    setConversionChanged(true)
  }

  const handleChangeTo = (value: ProjectionKey): void => {
    setTo(value)
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

  const processCsvData = (data: CsvData): void => {
    let headers: any = []
    // @ts-ignore
    Papa.parse(data.data, {
      download: data.isFile,
      header: true,
      step: (results: PapaParseResult) => {
        if (headers.length === 0) {
          headers = Object.keys(results.data)
          if (headers.length < 2) {
            console.error('CSV does not have enough columns')
            return
          }
        }
        const convertedRow = convertRow(results.data[headers[0]], results.data[headers[1]], from(), to())
        setRows((prevRows) => [...prevRows, convertedRow])
      },
      complete: () => setViewMap(false)
    })
  }

  const downloadCSV = (e: Event): void => {
    if ('preventDefault' in e) e.preventDefault()
    const parsed: string = Papa.unparse(rows(), {
      delimiter: ';'
    })
    const BOM: string = '\uFEFF'
    const blob = new Blob([BOM + parsed], { type: 'text/csv;charset=utf-8;' })

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'converted.csv'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
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
      const convertedData = rows().map(row => convertRow(+row.x, +row.y, currentFrom, currentTo))
      setRows(convertedData)
      setConversionChanged(false)
    }
  })

  createEffect(() => {
    const hasMultipleRows = rows().length > 0
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
      <Box sx={{
        padding: 2,
        maxWidth: '60rem',
        margin: 'auto'
      }}
      >
        <Typography
          variant='h4' component='div' sx={{
            paddingTop: 2,
            paddingBottom: 5
          }}
        >
          Konvertera mellan SWEREF99, RT90, WGS84
        </Typography>
        <Stack
          spacing={2} direction='column'
          sx={{
            paddingBottom: 2
          }}
        >
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
          >
            <FormControl fullWidth>
              <InputLabel id='demo-simple-select-label'>Konvertera från</InputLabel>
              <Select
                value={from()}
                label='Konvertera från'
                onChange={({target}) => handleChangeFrom(target.value)}
              >
                {
            selectParams.map((p: any) => (
              <MenuItem value={p.value}>{p.text}</MenuItem>) // eslint-disable-line react/jsx-key
            )
          }
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id='demo-simple-select-label'>Konvertera till</InputLabel>
              <Select
                value={to()}
                label='Konvertera till'
                onChange={({target}) => handleChangeTo(target.value)}
              >
                {
            selectParams.map((p: any) => (
              <MenuItem value={p.value}>{p.text}</MenuItem> // eslint-disable-line react/jsx-key
            ))
            }
              </Select>
            </FormControl>
          </Stack>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
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
            <Button onClick={toggleMap} disabled={isDisabled()} variant='outlined'>
              {viewMap() ? 'Tabellvy' : 'Kartvy'}
            </Button>
            <Button onClick={downloadCSV} disabled={isDisabled()} variant='contained'>
              Ladda ned konverterad .csv
            </Button>
          </Stack>
          <FormControl fullWidth>
            <TextField
              id='outlined-basic'
              label='Klistra in url till fil från server'
              variant='outlined'
              onInput={e => parseRemote(e)}
            />
          </FormControl>
          <FormControl fullWidth>
            <TextField
              id='outlined-basic'
              label='Klistra in tabell med två kolumner'
              variant='outlined'
              multiline
              rows={6}
              onInput={e => parseString(e)}
              fullWidth
            />
          </FormControl>
        </Stack>
        {viewMap() && rows().length > 0 && <LeafletMap rows={rows} />}
        {!viewMap() && rows().length > 0 && <ResultTable twoWay={twoWay} rows={rows} />}
      </Box>
      <InfoDialog open={open} onClose={handleClickClose} />
    </div>
  )
}
